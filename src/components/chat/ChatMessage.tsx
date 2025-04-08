
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DataVisualizations from "@/components/DataVisualizations";

export interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualization?: any;
}

const ChatMessage = ({ message }: { message: ChatMessageProps }) => {
  const renderInChatVisualization = () => {
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
          <p className="text-sm">{message.content}</p>
          {renderInChatVisualization()}
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
