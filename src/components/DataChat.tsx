
import React, { useState, useEffect, useRef } from 'react';
import { ProcessedData } from "@/utils/fileProcessing";
import { chatWithLLM } from "@/utils/llmService";
import { ChatMessageProps } from './chat/ChatMessage';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { DEFAULT_SUGGESTIONS } from './chat/SuggestionChips';

interface DataChatProps {
  processedData: ProcessedData | null;
  onGenerateVisualization: (visualization: any) => void;
}

const DataChat = ({ processedData, onGenerateVisualization }: DataChatProps) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (inputMessage: string) => {
    if (!processedData) return;
    
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
      
      // Add error message
      const errorMessage: ChatMessageProps = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
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
      />
    </div>
  );
};

export default DataChat;
