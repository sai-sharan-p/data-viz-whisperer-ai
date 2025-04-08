
import React, { useState, useEffect, useRef } from 'react';
import { ProcessedData } from "@/utils/fileProcessing";
import { chatWithLLM } from "@/utils/llmService";
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
      content: "Hello! I'm your data chat assistant. I can answer questions about your data and provide insights. What would you like to know?",
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
      // Prepare chat history for LLM context
      const chatHistory = messages
        .filter(msg => msg.id !== 'welcome' && msg.id !== 'suggestions' && msg.id !== 'api-key-error')
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
      
      const responseMessage: ChatMessageProps = {
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
      
      // Check if it's an API key error
      if (error.message && error.message.includes("API key")) {
        setApiKeyError(true);
        const errorMessage: ChatMessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "⚠️ Gemini API key is not configured or is invalid. Please add a valid API key to enable advanced data analysis capabilities. You can get one from https://ai.google.dev/ and add it as VITE_GEMINI_API_KEY.",
        };
        setMessages((prev) => [...prev, errorMessage]);
        
        toast({
          title: "API Key Missing or Invalid",
          description: "Please add your Google Gemini API key to the environment variables.",
          variant: "destructive",
        });
      } else {
        // Add a generic error message
        const errorMessage: ChatMessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error processing your request: ${error.message}. Please try again with a different question.`,
        };
        
        setMessages((prev) => [...prev, errorMessage]);
      }
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

export default DataChat;
