
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import LoadingMessage from './LoadingMessage';
import SuggestionChips, { DEFAULT_SUGGESTIONS } from './SuggestionChips';

interface MessageListProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, isLoading, onSuggestionClick, containerRef }: MessageListProps) => {
  const renderSuggestions = () => {
    if (messages.find(msg => msg.id === 'suggestions')) {
      return (
        <SuggestionChips 
          suggestions={DEFAULT_SUGGESTIONS} 
          onSuggestionClick={onSuggestionClick} 
        />
      );
    }
    return null;
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={containerRef}>
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
        {renderSuggestions()}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
