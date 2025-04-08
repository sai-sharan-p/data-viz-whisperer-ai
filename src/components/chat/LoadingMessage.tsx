
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const LoadingMessage = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start max-w-[80%]">
        <Avatar className="mr-2 mt-0.5">
          <AvatarImage src="/assistant.png" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="px-4 py-2 rounded-lg bg-muted">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Analyzing your data...</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">This might take a moment</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
