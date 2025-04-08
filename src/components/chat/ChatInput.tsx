
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSendMessage, isLoading, disabled = false, placeholder = "Ask a question about your data..." }: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !disabled) {
              handleSend();
            }
          }}
          className="mr-2"
          disabled={disabled || isLoading}
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading || disabled || !inputMessage.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
