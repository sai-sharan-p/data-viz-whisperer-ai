
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export const DEFAULT_SUGGESTIONS = [
  "What are the key insights from this dataset?",
  "Summarize the main trends in the data",
  "Show me a visualization of the most important variables",
  "What correlations exist between numerical variables?",
  "How is the data distributed?",
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
          className="text-sm"
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionChips;
