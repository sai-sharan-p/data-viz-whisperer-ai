import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Send } from "lucide-react";
import { ProcessedData } from "@/utils/fileProcessing";
import { chatWithLLM } from "@/utils/llmService";
import DataVisualizations from "@/components/DataVisualizations";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualization?: any;
}

interface DataChatProps {
  processedData: ProcessedData | null;
  onGenerateVisualization: (visualization: any) => void;
}

const SUGGESTIONS = [
  "What are the key trends in the data?",
  "Can you provide a summary of the dataset?",
  "Which variables have the strongest correlation?",
  "What insights can you share about this dataset?",
];

const DataChat = ({ processedData, onGenerateVisualization }: DataChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your data chat assistant. I can answer questions about your data and provide insights. What would you like to know?",
    };
    setMessages([welcomeMessage]);

    // Suggestion chips
    const suggestionMessage: ChatMessage = {
      id: 'suggestions',
      role: 'assistant',
      content: "Here are some questions to get started:",
    };
    setMessages(prev => [...prev, suggestionMessage]);
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !processedData) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Prepare chat history for LLM context
      const chatHistory = messages
        .filter(msg => msg.id !== 'welcome' && msg.id !== 'suggestions')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the new user message
      chatHistory.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Call LLM service
      const llmResponse = await chatWithLLM(
        userMessage.content,
        processedData,
        chatHistory
      );
      
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: llmResponse.message,
        visualization: llmResponse.visualization
      };
      
      setMessages((prev) => [...prev, responseMessage]);
      
      if (responseMessage.visualization) {
        onGenerateVisualization(responseMessage.visualization);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestions = () => {
    if (messages.find(msg => msg.id === 'suggestions')) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {SUGGESTIONS.map((suggestion, index) => (
            <Button 
              key={index} 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setInputMessage(suggestion);
              }}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              {suggestion}
            </Button>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderInChatVisualization = (message: ChatMessage) => {
    if (message.visualization) {
      return (
        <Card className="w-full mt-2">
          <CardContent className="p-2 h-64">
            <DataVisualizations visualizations={[message.visualization]} />
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start max-w-[80%]">
                {message.role === 'assistant' && (
                  <Avatar className="mr-2 mt-0.5">
                    <AvatarImage src="/assistant.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {renderInChatVisualization(message)}
                </div>
                {message.role === 'user' && (
                  <Avatar className="ml-2 mt-0.5">
                    <AvatarImage src="/user.png" alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%]">
                <Avatar className="mr-2 mt-0.5">
                  <AvatarImage src="/assistant.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-muted">
                  <p className="text-sm">Processing your request...</p>
                </div>
              </div>
            </div>
          )}
          {renderSuggestions()}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Ask a question about your data..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="mr-2"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataChat;
