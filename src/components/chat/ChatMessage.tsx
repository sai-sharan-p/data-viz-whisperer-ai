
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualization?: any;
}

const ChatMessage = ({ message }: { message: ChatMessageProps }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        </div>
        {message.role === 'user' && (
          <Avatar className="ml-2 mt-0.5">
            <AvatarImage src="/user.png" alt="User" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
