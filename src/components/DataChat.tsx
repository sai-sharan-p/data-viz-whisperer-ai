
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcessedData } from "@/utils/fileProcessing";
import { Insight, VisualizationData } from "@/utils/dataAnalysis";
import { MessageCircle, SendHorizontal, Bot, User, BarChartIcon, LineChartIcon, PieChartIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface DataChatProps {
  processedData: ProcessedData | null;
  onGenerateVisualization: (visualization: VisualizationData) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualization?: VisualizationData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// This function will be replaced with an actual LLM API call in production
const callLLMApi = async (query: string, data: ProcessedData): Promise<ChatMessage> => {
  // This is a mock implementation that will be replaced with a real API call
  console.log('LLM would be called with:', { query, dataStructure: data.headers });
  
  return generateMockResponse(query, data);
};

const DataChat = ({ processedData, onGenerateVisualization }: DataChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I can help you analyze your data. Ask me questions about your dataset or request visualizations.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !processedData) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // In production, this will be replaced with a real API call to an LLM
      const response = await callLLMApi(inputMessage, processedData);
      setMessages((prev) => [...prev, response]);
      
      if (response.visualization) {
        onGenerateVisualization(response.visualization);
      }
    } catch (error) {
      console.error('Error getting response from LLM:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInChatVisualization = (visualization: VisualizationData) => {
    switch (visualization.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visualization.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 10 }} 
                label={{ value: visualization.xAxis, position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                label={{ value: visualization.yAxis, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), visualization.yAxis || 'Value']} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="value" fill="#8884d8" name={visualization.yAxis || 'Value'} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visualization.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timePeriod" 
                tick={{ fontSize: 10 }} 
                label={{ value: visualization.xAxis, position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                label={{ value: visualization.yAxis, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), visualization.yAxis || 'Value']} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="average" stroke="#8884d8" name={visualization.yAxis || 'Value'} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={visualization.data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="count"
                nameKey="category"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {visualization.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [Number(value).toLocaleString(), name]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={visualization.xAxis} 
                tick={{ fontSize: 10 }}
                label={{ value: visualization.xAxis, position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={visualization.yAxis} 
                tick={{ fontSize: 10 }}
                label={{ value: visualization.yAxis, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => [value, visualization.yAxis || 'Value']} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Scatter name={`${visualization.xAxis || 'X'} vs ${visualization.yAxis || 'Y'}`} data={visualization.data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visualization.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="binCenter" 
                tick={{ fontSize: 10 }}
                label={{ value: visualization.xAxis, position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [value, 'Frequency']}
                labelFormatter={(label) => `${visualization.xAxis}: ${Number(label).toFixed(2)}`}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="count" fill="#8884d8" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="text-sm text-muted-foreground py-2">
            Visualization preview not available
          </div>
        );
    }
  };

  const getSuggestions = () => {
    if (!processedData) return [];
    
    const { headers, summary } = processedData;
    const suggestions = [];
    
    if (summary.numericColumns.length > 0) {
      const numericVar = summary.numericColumns[0];
      suggestions.push(`What is the average ${numericVar}?`);
      suggestions.push(`Show histogram of ${numericVar}`);
      suggestions.push(`Show trend of ${numericVar}`);
    }
    
    if (summary.categoricalColumns.length > 0) {
      const catVar = summary.categoricalColumns[0];
      suggestions.push(`Count by ${catVar}`);
      suggestions.push(`Show pie chart of ${catVar}`);
    }
    
    if (summary.numericColumns.length > 1) {
      const numVar1 = summary.numericColumns[0];
      const numVar2 = summary.numericColumns[1];
      suggestions.push(`Show scatter plot of ${numVar1} vs ${numVar2}`);
    }
    
    suggestions.push("What insights can you give me about this data?");
    
    return suggestions;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Data Analysis Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 px-4 pt-2">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'} rounded-lg px-3 py-2`}
                >
                  <div className="mr-2 mt-0.5">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {message.visualization && (
                      <div className="mt-3 mb-2 bg-card rounded-md p-2 border">
                        <div className="text-xs font-medium mb-1">
                          {message.visualization.title}
                        </div>
                        {renderInChatVisualization(message.visualization)}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => onGenerateVisualization(message.visualization!)}
                        >
                          <BarChartIcon className="h-3 w-3 mr-1" />
                          View in Visualizations Tab
                        </Button>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {processedData && !messages.some(m => m.id === 'suggestions') && (
          <div className="px-4 py-2">
            <div className="text-xs text-muted-foreground mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {getSuggestions().map((suggestion, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setInputMessage(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your data..."
              disabled={!processedData || isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!processedData || isLoading || !inputMessage.trim()}
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

// Export the generateMockResponse function so it can be used by the LLM API function
// This will be used by the temporary callLLMApi function and will be replaced in production
const generateMockResponse = (query: string, data: ProcessedData): ChatMessage => {
  const lowerQuery = query.toLowerCase();
  const { headers, summary, data: dataRows } = data;
  
  // Check if asking for a specific variable
  const mentionedVariables = headers.filter(header => 
    lowerQuery.includes(header.toLowerCase())
  );
  
  // Check for statistical questions
  if (mentionedVariables.length > 0) {
    const variable = mentionedVariables[0];
    
    // Average/mean questions
    if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `The average ${variable} is ${average.toFixed(2)}.`,
          timestamp: new Date()
        };
      } else {
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I can't calculate the average for ${variable} because it's not a numeric column.`,
          timestamp: new Date()
        };
      }
    }
    
    // Min/max questions
    if (lowerQuery.includes('minimum') || lowerQuery.includes('min')) {
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        const min = Math.min(...values);
        
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `The minimum ${variable} is ${min}.`,
          timestamp: new Date()
        };
      }
    }
    
    if (lowerQuery.includes('maximum') || lowerQuery.includes('max')) {
      if (summary.numericColumns.includes(variable)) {
        const values = dataRows.map(row => Number(row[variable])).filter(val => !isNaN(val));
        const max = Math.max(...values);
        
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `The maximum ${variable} is ${max}.`,
          timestamp: new Date()
        };
      }
    }
    
    // Count by category
    if ((lowerQuery.includes('count') || lowerQuery.includes('how many')) && 
        lowerQuery.includes('by')) {
      const categoryVars = summary.categoricalColumns.filter(
        col => mentionedVariables.includes(col) || lowerQuery.includes(col.toLowerCase())
      );
      
      if (categoryVars.length > 0) {
        const categoryVar = categoryVars[0];
        const countByCategory: Record<string, number> = {};
        
        dataRows.forEach(row => {
          const category = String(row[categoryVar]);
          countByCategory[category] = (countByCategory[category] || 0) + 1;
        });
        
        const sortedCategories = Object.entries(countByCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        
        let responseContent = `Count by ${categoryVar}:\n\n`;
        sortedCategories.forEach(([category, count]) => {
          responseContent += `- ${category}: ${count} (${((count / dataRows.length) * 100).toFixed(1)}%)\n`;
        });
        
        // Create visualization for count by category
        const visualization: VisualizationData = {
          type: 'bar',
          title: `Count by ${categoryVar}`,
          description: `Distribution of data points across ${categoryVar} categories`,
          xAxis: categoryVar,
          yAxis: 'Count',
          data: sortedCategories.map(([category, count]) => ({
            category,
            value: count
          }))
        };
        
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          visualization
        };
      }
    }
  }
  
  // Sample basic responses
  if (lowerQuery.includes('how many') && lowerQuery.includes('row')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Your dataset has ${summary.rowCount} rows of data.`,
      timestamp: new Date()
    };
  }
  
  if (lowerQuery.includes('columns') || lowerQuery.includes('variables')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Your dataset has ${headers.length} columns: ${headers.join(', ')}.`,
      timestamp: new Date()
    };
  }
  
  if ((lowerQuery.includes('show') || lowerQuery.includes('create') || lowerQuery.includes('visualize') || lowerQuery.includes('plot')) && 
      mentionedVariables.length > 0) {
    const variable = mentionedVariables[0];
    
    // Generate a visualization based on variable type and query terms
    let visualization: VisualizationData | undefined;
    
    if (summary.numericColumns.includes(variable)) {
      // Choose visualization type based on query
      if (lowerQuery.includes('histogram') || lowerQuery.includes('distribution')) {
        visualization = {
          type: 'histogram',
          title: `Distribution of ${variable}`,
          description: `Histogram showing the distribution of values for ${variable}`,
          xAxis: variable,
          yAxis: 'Frequency',
          data: Array(10).fill(0).map((_, i) => ({
            binStart: i * 10,
            binCenter: i * 10 + 5,
            binEnd: (i + 1) * 10,
            count: Math.floor(Math.random() * 100) + 10
          }))
        };
      } else if (lowerQuery.includes('line') || lowerQuery.includes('trend')) {
        visualization = {
          type: 'line',
          title: `Trend of ${variable}`,
          description: `Line chart showing the trend of ${variable}`,
          xAxis: 'Time Period',
          yAxis: variable,
          data: Array(12).fill(0).map((_, i) => ({
            timePeriod: `Period ${i+1}`,
            average: Math.floor(Math.random() * 100) + 50
          }))
        };
      } else if (lowerQuery.includes('bar')) {
        visualization = {
          type: 'bar',
          title: `${variable} by Category`,
          description: `Bar chart showing ${variable} by category`,
          xAxis: 'Category',
          yAxis: variable,
          data: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'].map(cat => ({
            category: cat,
            value: Math.floor(Math.random() * 100) + 20
          }))
        };
      } else {
        // Default to scatter plot for numeric variables if not specified
        visualization = {
          type: 'scatter',
          title: `${variable} Relationship`,
          description: `Scatter plot showing relationship with ${variable}`,
          xAxis: 'Related Variable',
          yAxis: variable,
          data: Array(30).fill(0).map((_, i) => ({
            id: i,
            x: Math.floor(Math.random() * 100),
            y: Math.floor(Math.random() * 100)
          }))
        };
      }
    } else if (summary.categoricalColumns.includes(variable)) {
      // Choose visualization type based on query
      if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
        visualization = {
          type: 'pie',
          title: `Distribution of ${variable}`,
          description: `Pie chart showing the distribution of categories for ${variable}`,
          data: ['Category A', 'Category B', 'Category C', 'Category D'].map(cat => ({
            category: cat,
            count: Math.floor(Math.random() * 100) + 10
          }))
        };
      } else {
        // Default to bar chart for categorical variables
        visualization = {
          type: 'bar',
          title: `Distribution of ${variable}`,
          description: `Bar chart showing the distribution of categories for ${variable}`,
          xAxis: variable,
          yAxis: 'Count',
          data: ['Category A', 'Category B', 'Category C', 'Category D'].map(cat => ({
            category: cat,
            value: Math.floor(Math.random() * 100) + 10
          }))
        };
      }
    }
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Here's a visualization for the ${variable} variable:`,
      timestamp: new Date(),
      visualization
    };
  }
  
  if (lowerQuery.includes('insight') || lowerQuery.includes('tell me about')) {
    let content = "Based on my analysis of your data:";
    
    if (mentionedVariables.length > 0) {
      const variable = mentionedVariables[0];
      content = `Based on my analysis of ${variable}:`;
    }
    
    content += "\n\n1. There appears to be a correlation between customer age and purchase amount.\n\n";
    content += "2. The most common category is 'Electronics', comprising 42% of all purchases.\n\n";
    content += "3. There is a seasonal pattern in sales with peaks in November and December.";
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
  }
  
  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: "I'm here to help you analyze your data. You can ask me to show visualizations, calculate statistics like 'average price', 'count by category', or provide insights about specific variables.",
    timestamp: new Date()
  };
};

export default DataChat;
