
import React, { useState, useEffect, useRef } from 'react';
import { ProcessedData } from "@/utils/fileProcessing";
import { ChatMessageProps } from './chat/ChatMessage';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { DEFAULT_SUGGESTIONS } from './chat/SuggestionChips';
import { useToast } from "@/components/ui/use-toast";

interface DataChatProps {
  processedData: ProcessedData | null;
  onGenerateVisualization: (visualization: any) => void;
}

const DataChat = ({ processedData, onGenerateVisualization }: DataChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMessageProps = {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your FinFlow data assistant. I can help you understand your financial data by answering questions and providing insights. What would you like to know about your data?",
    };
    setMessages([welcomeMessage]);

    // Suggestion chips
    const suggestionMessage: ChatMessageProps = {
      id: 'suggestions',
      role: 'assistant',
      content: "Here are some questions to get started:",
    };
    setMessages(prev => [...prev, suggestionMessage]);
    
    // Check for API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      const apiKeyErrorMessage: ChatMessageProps = {
        id: 'api-key-error',
        role: 'assistant',
        content: "⚠️ Gemini API key is not configured. Please add your API key to enable advanced data analysis capabilities. You can get one from https://ai.google.dev/ and add it as VITE_GEMINI_API_KEY.",
      };
      setMessages(prev => [...prev, apiKeyErrorMessage]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (inputMessage: string) => {
    if (!processedData) {
      toast({
        title: "No data available",
        description: "Please upload a dataset first.",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage: ChatMessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Generate insights-only response using the data
      const response = await generateDataInsights(inputMessage, processedData);
      
      const responseMessage: ChatMessageProps = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
      };
      
      setMessages((prev) => [...prev, responseMessage]);
      
    } catch (error) {
      console.error("Error processing message:", error);
      
      const errorMessage: ChatMessageProps = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error processing your request: ${error.message}. Please try again with a different question.`,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSuggestionClick}
        containerRef={chatContainerRef}
      />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={apiKeyError}
        placeholder={apiKeyError ? "API key required to send messages" : "Ask a question about your data..."}
      />
      {apiKeyError && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-700 text-sm">
          <p className="font-semibold">Missing API Key</p>
          <p>To use the chat feature, you need to add a Google Gemini API key as VITE_GEMINI_API_KEY in your environment variables.</p>
        </div>
      )}
    </div>
  );
};

// Function to generate data insights without visualizations
const generateDataInsights = async (
  userMessage: string,
  processedData: ProcessedData
): Promise<string> => {
  const lowerQuery = userMessage.toLowerCase();
  const { headers, summary, data: dataRows } = processedData;
  
  // Check if asking for a specific variable
  const mentionedVariables = headers.filter(header => 
    lowerQuery.includes(header.toLowerCase())
  );
  
  // Sample basic responses focused on insights
  if (lowerQuery.includes('how many') && lowerQuery.includes('row')) {
    return `Your dataset contains ${summary.rowCount} rows of financial data.`;
  }
  
  if (lowerQuery.includes('columns') || lowerQuery.includes('variables')) {
    return `Your dataset has ${headers.length} columns: ${headers.join(', ')}. This includes ${summary.numericColumns.length} numeric variables and ${summary.categoricalColumns.length} categorical variables.`;
  }
  
  if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
    const numVar = mentionedVariables.find(variable => summary.numericColumns.includes(variable));
    
    if (numVar) {
      const values = dataRows.map(row => Number(row[numVar])).filter(val => !isNaN(val));
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      return `The average ${numVar} is ${average.toFixed(2)}. This gives you a baseline for understanding the central tendency of this financial metric.`;
    }
  }
  
  if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
    const catVar = mentionedVariables.find(variable => summary.categoricalColumns.includes(variable));
    
    if (catVar) {
      const categories = new Map<string, number>();
      
      dataRows.forEach(row => {
        const value = String(row[catVar] || '');
        if (value) {
          categories.set(value, (categories.get(value) || 0) + 1);
        }
      });
      
      const categoriesText = Array.from(categories.entries())
        .map(([category, count]) => `- ${category}: ${count} records`)
        .join('\n');
      
      return `Here's the breakdown for ${catVar}:\n\n${categoriesText}\n\nThis distribution can help you understand the composition of your financial data.`;
    }
  }
  
  if (lowerQuery.includes('insight') || lowerQuery.includes('tell me about') || lowerQuery.includes('summary')) {
    if (mentionedVariables.length > 0) {
      const variable = mentionedVariables[0];
      
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min;
        
        return `Here are key insights about ${variable}:

• **Average Value**: ${average.toFixed(2)}
• **Highest Value**: ${max.toFixed(2)}
• **Lowest Value**: ${min.toFixed(2)}
• **Range**: ${range.toFixed(2)}
• **Data Points**: ${values.length} records

**Financial Insight**: The range of ${range.toFixed(2)} indicates ${range > average ? 'high variability' : 'relatively stable values'} in this metric, which ${range > average ? 'suggests you should investigate outliers' : 'indicates consistent performance'}.`;
      } else if (summary.categoricalColumns.includes(variable)) {
        const categories = new Map<string, number>();
        dataRows.forEach(row => {
          const value = String(row[variable] || '');
          if (value) {
            categories.set(value, (categories.get(value) || 0) + 1);
          }
        });
        
        const sortedCategories = Array.from(categories.entries())
          .sort((a, b) => b[1] - a[1]);
        
        const topCategory = sortedCategories[0];
        const diversity = sortedCategories.length;
        
        return `Here are key insights about ${variable}:

• **Most Common**: '${topCategory[0]}' (${((topCategory[1] / dataRows.length) * 100).toFixed(1)}% of records)
• **Total Categories**: ${diversity} unique values
• **Distribution**: ${diversity > 5 ? 'High diversity' : 'Low diversity'} in categories

**Financial Insight**: The ${diversity > 5 ? 'high diversity suggests complex categorization' : 'low diversity indicates clear groupings'}, which can help in ${diversity > 5 ? 'detailed analysis but may need consolidation for reporting' : 'simplified reporting and trend analysis'}.`;
      }
    } else {
      return `Here's a summary of your financial dataset:

• **Dataset Size**: ${dataRows.length} records across ${headers.length} variables
• **Numeric Metrics**: ${summary.numericColumns.length} (${summary.numericColumns.join(', ')})
• **Categories**: ${summary.categoricalColumns.length} (${summary.categoricalColumns.join(', ')})

**Key Observations**:
- Your dataset has a ${summary.numericColumns.length > summary.categoricalColumns.length ? 'quantitative focus' : 'good mix of quantitative and categorical data'}
- With ${dataRows.length} records, you have ${dataRows.length > 1000 ? 'substantial data for robust analysis' : 'sufficient data for meaningful insights'}

Ask me specific questions about any variable to dive deeper into the insights!`;
    }
  }
  
  if (lowerQuery.includes('trend') || lowerQuery.includes('pattern')) {
    if (mentionedVariables.length > 0) {
      const variable = mentionedVariables[0];
      
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        
        // Simple trend analysis
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        
        const trendDirection = secondAvg > firstAvg ? 'increasing' : secondAvg < firstAvg ? 'decreasing' : 'stable';
        const changePercent = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100);
        
        return `**Trend Analysis for ${variable}:**

• **Direction**: ${trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1)} trend
• **Change**: ${changePercent.toFixed(1)}% ${trendDirection === 'increasing' ? 'increase' : trendDirection === 'decreasing' ? 'decrease' : 'variation'}
• **First Half Average**: ${firstAvg.toFixed(2)}
• **Second Half Average**: ${secondAvg.toFixed(2)}

**Financial Interpretation**: This ${trendDirection} trend ${changePercent > 10 ? 'indicates significant movement' : 'shows moderate variation'} and ${trendDirection === 'increasing' ? 'suggests positive momentum' : trendDirection === 'decreasing' ? 'may require attention' : 'indicates stability'}.`;
      }
    }
  }
  
  // Default response for unrecognized queries
  return `I can help you analyze your financial data! Here are some things you can ask me:

• **Basic Statistics**: "What's the average revenue?" or "Show me the total expenses"
• **Data Composition**: "How many categories are there?" or "What variables do I have?"
• **Trends**: "What's the trend in sales?" or "Is there a pattern in costs?"
• **Comparisons**: "Compare Q1 vs Q2 revenue" or "Which category has the highest values?"
• **Insights**: "Tell me about profit margins" or "Give me insights on cash flow"

Try asking a specific question about your data, and I'll provide detailed insights!`;
};

export default DataChat;
