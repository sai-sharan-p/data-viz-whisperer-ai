
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export const DEFAULT_SUGGESTIONS = [
  "What are the key trends in the data?",
  "Can you provide a summary of the dataset?",
  "Which variables have the strongest correlation?",
  "What insights can you share about this dataset?",
];

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionChips = ({ suggestions, onSuggestionClick }: SuggestionChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <Button 
          key={index} 
          variant="secondary" 
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionChips;
