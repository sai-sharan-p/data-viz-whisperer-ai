
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProcessedData } from "@/utils/fileProcessing";
import { BarChart3, LineChart, PieChart } from "lucide-react";

interface VariableSelectorProps {
  processedData: ProcessedData;
  onSelectVariable: (variable: string) => void;
  selectedVariable: string | null;
}

const VariableSelector = ({ 
  processedData, 
  onSelectVariable, 
  selectedVariable 
}: VariableSelectorProps) => {
  const { headers, summary } = processedData;
  
  const handleVariableChange = (value: string) => {
    onSelectVariable(value);
  };
  
  const getVariableTypeIcon = (variable: string) => {
    if (summary.numericColumns.includes(variable)) {
      return <LineChart className="h-4 w-4 text-blue-600" />;
    } else if (summary.dateColumns.includes(variable)) {
      return <LineChart className="h-4 w-4 text-amber-600" />;
    } else {
      return <PieChart className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Select a Target Variable</CardTitle>
        <CardDescription>
          Choose the variable you want to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={handleVariableChange} value={selectedVariable || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a variable" />
            </SelectTrigger>
            <SelectContent>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  <div className="flex items-center gap-2">
                    {getVariableTypeIcon(header)}
                    <span>{header}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedVariable && (
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data points:</span>
                <span className="text-sm">{summary.rowCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Variable type:</span>
                <span className="text-sm">
                  {summary.numericColumns.includes(selectedVariable) 
                    ? 'Numeric' 
                    : summary.dateColumns.includes(selectedVariable)
                      ? 'Date'
                      : 'Categorical'}
                </span>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={() => {}}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze {selectedVariable}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableSelector;
