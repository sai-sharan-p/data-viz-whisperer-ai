
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const LoadingMessage = () => {
  return (
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
  );
};

export default LoadingMessage;
