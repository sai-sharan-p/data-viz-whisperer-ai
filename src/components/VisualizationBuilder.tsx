
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Send } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DataVisualizations from "@/components/DataVisualizations";
import { ProcessedData } from "@/utils/fileProcessing";
import { VisualizationData } from "@/utils/dataAnalysis";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualization?: VisualizationData;
}

interface VisualizationBuilderProps {
  processedData: ProcessedData | null;
  onGenerateVisualization: (visualization: VisualizationData) => void;
}

const CHART_TYPES = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "scatter", label: "Scatter Plot" },
  { value: "histogram", label: "Histogram" },
];

const VisualizationBuilder = ({ processedData, onGenerateVisualization }: VisualizationBuilderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visualizations, setVisualizations] = useState<VisualizationData[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<string>("");
  const [selectedVariable, setSelectedVariable] = useState<string>("");
  const [secondaryVariable, setSecondaryVariable] = useState<string>("");
  const [chartTitle, setChartTitle] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to the Visualization Builder! I'll help you create custom visualizations from your data. Select a chart type and variables to get started.",
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateVisualization = () => {
    if (!processedData || !selectedChartType || !selectedVariable) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Please select a chart type and at least one variable to create a visualization.",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Create visualization based on selected params
    let visualization: VisualizationData | null = null;
    const title = chartTitle || `${selectedVariable} Visualization`;

    try {
      switch (selectedChartType) {
        case 'bar': {
          // For bar charts, we're visualizing counts of categorical variables
          // or ranges of numeric variables
          if (processedData.summary.categoricalColumns.includes(selectedVariable)) {
            // Create category counts
            const categories = new Map<string, number>();
            
            processedData.data.forEach(row => {
              const value = String(row[selectedVariable] || '');
              if (value) {
                categories.set(value, (categories.get(value) || 0) + 1);
              }
            });
            
            // Convert to array and sort by count (descending)
            const categoriesArray = Array.from(categories.entries())
              .map(([category, count]) => ({ category, value: count }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 10); // Limit to top 10 categories for visualization clarity
            
            visualization = {
              type: 'bar',
              title,
              description: `Distribution of ${selectedVariable}`,
              xAxis: selectedVariable,
              yAxis: 'Count',
              data: categoriesArray
            };
          } else if (processedData.summary.numericColumns.includes(selectedVariable)) {
            // Create bins for numeric data
            const values = processedData.data
              .map(row => Number(row[selectedVariable]))
              .filter(val => !isNaN(val));
            
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            const categoryCount = 8;
            const categorySize = range / categoryCount;
            
            const categories = Array(categoryCount).fill(0).map((_, i) => {
              const start = min + i * categorySize;
              const end = min + (i + 1) * categorySize;
              const categoryValues = values.filter(val => val >= start && val < end);
              
              return {
                category: `${start.toFixed(1)}-${end.toFixed(1)}`,
                value: categoryValues.length
              };
            });
            
            visualization = {
              type: 'bar',
              title,
              description: `Distribution of ${selectedVariable} by Range`,
              xAxis: 'Range',
              yAxis: 'Count',
              data: categories
            };
          }
          break;
        }
        case 'line': {
          // For line charts, we need to sort by some attribute
          // If secondary variable is selected, we can use that to sort
          const sortVariable = secondaryVariable || selectedVariable;
          const values = processedData.data
            .map(row => ({
              value: Number(row[selectedVariable]),
              sort: row[sortVariable]
            }))
            .filter(item => !isNaN(item.value))
            .sort((a, b) => {
              if (typeof a.sort === 'number' && typeof b.sort === 'number') {
                return a.sort - b.sort;
              }
              return String(a.sort).localeCompare(String(b.sort));
            });
          
          // Group data into points for the line chart
          // For large datasets, we'll aggregate data into periods
          const MAX_POINTS = 20;
          let lineData;
          
          if (values.length > MAX_POINTS) {
            const pointsPerPeriod = Math.ceil(values.length / MAX_POINTS);
            lineData = Array(Math.min(MAX_POINTS, values.length)).fill(0).map((_, i) => {
              const periodValues = values.slice(i * pointsPerPeriod, (i + 1) * pointsPerPeriod);
              const average = periodValues.reduce((sum, item) => sum + item.value, 0) / periodValues.length;
              
              return {
                timePeriod: `Point ${i+1}`,
                average
              };
            });
          } else {
            lineData = values.map((item, i) => ({
              timePeriod: `Point ${i+1}`,
              average: item.value
            }));
          }
          
          visualization = {
            type: 'line',
            title,
            description: `Trend of ${selectedVariable}`,
            xAxis: 'Point',
            yAxis: selectedVariable,
            data: lineData
          };
          break;
        }
        case 'pie': {
          // For pie charts, we're visualizing categorical variables
          if (processedData.summary.categoricalColumns.includes(selectedVariable)) {
            // Create category counts
            const categories = new Map<string, number>();
            
            processedData.data.forEach(row => {
              const value = String(row[selectedVariable] || '');
              if (value) {
                categories.set(value, (categories.get(value) || 0) + 1);
              }
            });
            
            // Convert to array and sort by count (descending)
            const categoriesArray = Array.from(categories.entries())
              .map(([category, count]) => ({ category, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 8); // Limit to top 8 categories for visualization clarity
            
            visualization = {
              type: 'pie',
              title,
              description: `Distribution of ${selectedVariable}`,
              data: categoriesArray
            };
          } else {
            // For numeric columns, we'll create ranges as categories
            const values = processedData.data
              .map(row => Number(row[selectedVariable]))
              .filter(val => !isNaN(val));
            
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            const categoryCount = 5;
            const categorySize = range / categoryCount;
            
            const categoriesArray = Array(categoryCount).fill(0).map((_, i) => {
              const start = min + i * categorySize;
              const end = min + (i + 1) * categorySize;
              const categoryValues = values.filter(val => val >= start && val < end);
              
              return {
                category: `${start.toFixed(1)}-${end.toFixed(1)}`,
                count: categoryValues.length
              };
            });
            
            visualization = {
              type: 'pie',
              title,
              description: `Distribution of ${selectedVariable} by Range`,
              data: categoriesArray
            };
          }
          break;
        }
        case 'scatter': {
          // For scatter plots, we need two variables
          if (!secondaryVariable) {
            const errorMessage: ChatMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "For scatter plots, please select a secondary variable.",
            };
            
            setMessages((prev) => [...prev, errorMessage]);
            return;
          }
          
          // Filter out rows with missing or invalid values
          const scatterData = processedData.data
            .filter(row => 
              row[selectedVariable] !== null && 
              row[selectedVariable] !== undefined &&
              row[secondaryVariable] !== null && 
              row[secondaryVariable] !== undefined
            )
            .map((row, i) => ({
              id: i,
              x: processedData.summary.numericColumns.includes(selectedVariable) 
                ? Number(row[selectedVariable]) 
                : String(row[selectedVariable]),
              y: processedData.summary.numericColumns.includes(secondaryVariable)
                ? Number(row[secondaryVariable])
                : String(row[secondaryVariable])
            }))
            .slice(0, 100); // Limit points for better visualization
          
          if (!processedData.summary.numericColumns.includes(selectedVariable) || 
              !processedData.summary.numericColumns.includes(secondaryVariable)) {
            const errorMessage: ChatMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "Scatter plots require numeric variables. Please select numeric columns for both variables.",
            };
            
            setMessages((prev) => [...prev, errorMessage]);
            return;
          }
          
          visualization = {
            type: 'scatter',
            title,
            description: `Relationship between ${selectedVariable} and ${secondaryVariable}`,
            xAxis: selectedVariable,
            yAxis: secondaryVariable,
            data: scatterData
          };
          break;
        }
        case 'histogram': {
          // For histograms, we need numeric data
          if (!processedData.summary.numericColumns.includes(selectedVariable)) {
            const errorMessage: ChatMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "Histograms require numeric variables. Please select a numeric column.",
            };
            
            setMessages((prev) => [...prev, errorMessage]);
            return;
          }
          
          const values = processedData.data
            .map(row => Number(row[selectedVariable]))
            .filter(val => !isNaN(val));
          
          // Create bins for histogram
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min;
          const binCount = 10;
          const binSize = range / binCount;
          
          const bins = Array(binCount).fill(0).map((_, i) => {
            const binStart = min + i * binSize;
            const binCenter = min + (i + 0.5) * binSize;
            const binEnd = min + (i + 1) * binSize;
            
            // Count values in each bin
            const count = values.filter(val => val >= binStart && val < binEnd).length;
            
            return {
              binStart,
              binCenter,
              binEnd,
              count
            };
          });
          
          visualization = {
            type: 'histogram',
            title,
            description: `Distribution of ${selectedVariable}`,
            xAxis: selectedVariable,
            yAxis: 'Frequency',
            data: bins
          };
          break;
        }
      }

      if (visualization) {
        // Add the visualization to the list
        setVisualizations(prev => [visualization!, ...prev]);
        
        // Send to parent component
        onGenerateVisualization(visualization);
        
        // Add success message with visualization
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've created a ${selectedChartType} chart for ${selectedVariable}.`,
          visualization: visualization
        };
        
        setMessages(prev => [...prev, successMessage]);
        
        // Reset form
        setSelectedChartType("");
        setSelectedVariable("");
        setSecondaryVariable("");
        setChartTitle("");
      }
    } catch (error) {
      console.error("Error creating visualization:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error creating the visualization. Please try different parameters.",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const needsSecondaryVariable = selectedChartType === 'scatter';

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                  {message.visualization && (
                    <Card className="w-full mt-2">
                      <CardContent className="p-2 h-64">
                        <DataVisualizations visualizations={[message.visualization]} />
                      </CardContent>
                    </Card>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="ml-2 mt-0.5">
                    <AvatarImage src="/user.png" alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Create New Visualization</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Chart Type</label>
              <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Primary Variable</label>
              <Select value={selectedVariable} onValueChange={setSelectedVariable} disabled={!processedData}>
                <SelectTrigger>
                  <SelectValue placeholder="Select variable" />
                </SelectTrigger>
                <SelectContent>
                  {processedData?.headers.map(header => (
                    <SelectItem key={header} value={header}>
                      {header} {processedData.summary.numericColumns.includes(header) ? "(Numeric)" : "(Category)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {needsSecondaryVariable && (
              <div>
                <label className="text-sm font-medium mb-1 block">Secondary Variable</label>
                <Select value={secondaryVariable} onValueChange={setSecondaryVariable} disabled={!processedData}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {processedData?.headers.map(header => (
                      <SelectItem key={header} value={header}>
                        {header} {processedData.summary.numericColumns.includes(header) ? "(Numeric)" : "(Category)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-1 block">Chart Title (Optional)</label>
              <Input 
                type="text"
                placeholder="Enter chart title"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCreateVisualization} 
            disabled={!processedData || !selectedChartType || !selectedVariable}
            className="w-full"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Create Visualization
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualizationBuilder;
