
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcessedData } from "@/utils/fileProcessing";
import { Insight, VisualizationData } from "@/utils/dataAnalysis";
import { MessageCircle, SendHorizontal, Bot, User, BarChart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

  const handleSendMessage = () => {
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
    
    // Simulate AI response
    setTimeout(() => {
      const response = generateMockResponse(inputMessage, processedData);
      setMessages((prev) => [...prev, response]);
      
      if (response.visualization) {
        onGenerateVisualization(response.visualization);
      }
      
      setIsLoading(false);
    }, 1200);
  };

  const generateMockResponse = (query: string, data: ProcessedData): ChatMessage => {
    const lowerQuery = query.toLowerCase();
    const { headers, summary } = data;
    
    // Check if asking for a specific variable
    const mentionedVariables = headers.filter(header => 
      lowerQuery.includes(header.toLowerCase())
    );
    
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
      
      // Generate a visualization based on variable type
      let visualization: VisualizationData | undefined;
      
      if (summary.numericColumns.includes(variable)) {
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
      } else if (summary.categoricalColumns.includes(variable)) {
        visualization = {
          type: 'pie',
          title: `Distribution of ${variable}`,
          description: `Pie chart showing the distribution of categories for ${variable}`,
          data: ['Category A', 'Category B', 'Category C', 'Category D'].map(cat => ({
            category: cat,
            count: Math.floor(Math.random() * 100) + 10
          }))
        };
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
      content: "I'm here to help you analyze your data. You can ask me to show visualizations, calculate statistics, or provide insights about specific variables.",
      timestamp: new Date()
    };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat with Your Data
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => onGenerateVisualization(message.visualization!)}
                      >
                        <BarChart className="h-3 w-3 mr-1" />
                        Show Visualization
                      </Button>
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

export default DataChat;
