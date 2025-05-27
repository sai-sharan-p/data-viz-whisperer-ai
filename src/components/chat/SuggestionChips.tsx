
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export const DEFAULT_SUGGESTIONS = [
  "What are the key insights from this dataset?",
  "Show me a summary of the main trends",
  "What correlations exist between variables?"
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
          className="text-sm bg-navy-100 hover:bg-navy-200 text-navy-800 border-navy-300"
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionChips;
