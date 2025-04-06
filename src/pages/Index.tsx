
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Brain, FileBarChart, Database, FileText, ChevronLeft, BarChart, MessageCircle } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import VariableSelector from "@/components/VariableSelector";
import DataVisualizations from "@/components/DataVisualizations";
import InsightsPanel from "@/components/InsightsPanel";
import DataChat from "@/components/DataChat";
import { ProcessedData, processFile } from "@/utils/fileProcessing";
import { VisualizationData, Insight, analyzeDataset } from "@/utils/dataAnalysis";

const Index = () => {
  const { toast } = useToast();
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [analyzedVariable, setAnalyzedVariable] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<VisualizationData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"visualize" | "chat">("visualize");
  
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setProcessedData(null);
      setSelectedVariable(null);
      setAnalyzedVariable(null);
      setVisualizations([]);
      setInsights([]);
      
      const data = await processFile(file);
      setProcessedData(data);
      
      toast({
        title: "File processed successfully",
        description: `Found ${data.headers.length} columns and ${data.summary.rowCount} rows.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSelectVariable = (variable: string) => {
    setSelectedVariable(variable);
  };
  
  const handleAnalyzeData = () => {
    if (!processedData || !selectedVariable) {
      toast({
        title: "Cannot analyze data",
        description: "Please select a target variable first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalyzedVariable(selectedVariable);
    
    try {
      console.log("Analyzing data for variable:", selectedVariable);
      // Direct analysis without setTimeout to help with debugging
      const result = analyzeDataset(processedData, selectedVariable);
      console.log("Analysis result:", result);
      
      setVisualizations(result.visualizations);
      setInsights(result.insights);
      
      toast({
        title: "Analysis complete",
        description: `Generated ${result.visualizations.length} visualizations and ${result.insights.length} insights.`,
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Error analyzing data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleGenerateVisualization = (visualization: VisualizationData) => {
    // Add the visualization from chat to the visualizations panel
    setVisualizations(prev => [visualization, ...prev]);
    // Switch to the visualize tab
    setActiveTab("visualize");
    
    toast({
      title: "Visualization generated",
      description: `New visualization for ${visualization.title} has been added.`,
    });
  };
  
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber === 1) {
      return processedData ? "complete" : "current";
    } else if (stepNumber === 2) {
      return !processedData ? "upcoming" : selectedVariable ? "complete" : "current";
    } else if (stepNumber === 3) {
      return !processedData || !selectedVariable ? "upcoming" : analyzedVariable ? "complete" : "current";
    }
    return "upcoming";
  };
  
  const renderInitialView = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-dataviz-teal/10 rounded-full mb-4">
          <FileBarChart className="h-8 w-8 text-dataviz-teal" />
        </div>
        <h1 className="text-3xl font-bold text-dataviz-blue mb-2">Data Viz Whisperer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your data, select variables to analyze, and discover insights through powerful visualizations.
        </p>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <StepIndicator number={1} status={getStepStatus(1)} label="Upload Data" />
        <StepConnector />
        <StepIndicator number={2} status={getStepStatus(2)} label="Select Variable" />
        <StepConnector />
        <StepIndicator number={3} status={getStepStatus(3)} label="Analyze" />
      </div>
      
      <div className="grid gap-8">
        <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        
        {processedData && (
          <div className="grid sm:grid-cols-2 gap-6">
            <VariableSelector 
              processedData={processedData} 
              onSelectVariable={handleSelectVariable} 
              selectedVariable={selectedVariable}
            />
            
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Dataset Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <DataStatCard 
                  icon={<FileText className="h-4 w-4" />}
                  label="Rows" 
                  value={processedData.summary.rowCount} 
                />
                <DataStatCard 
                  icon={<Database className="h-4 w-4" />}
                  label="Columns" 
                  value={processedData.headers.length} 
                />
                <DataStatCard 
                  icon={<BarChart className="h-4 w-4" />}
                  label="Numeric Variables" 
                  value={processedData.summary.numericColumns.length} 
                />
                <DataStatCard 
                  icon={<Brain className="h-4 w-4" />}
                  label="Categorical Variables" 
                  value={processedData.summary.categoricalColumns.length} 
                />
              </div>
              
              <Button
                className="mt-4"
                disabled={!selectedVariable || isAnalyzing}
                onClick={handleAnalyzeData}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Data"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderAnalysisView = () => (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setAnalyzedVariable(null);
              setVisualizations([]);
              setInsights([]);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Analysis: {analyzedVariable}</h1>
          <Badge variant="outline" className="ml-2">
            {processedData?.summary.numericColumns.includes(analyzedVariable || "") 
              ? "Numeric" 
              : processedData?.summary.dateColumns.includes(analyzedVariable || "")
                ? "Date"
                : "Categorical"}
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "visualize" | "chat")}>
          <TabsList>
            <TabsTrigger value="visualize" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TabsContent value="visualize" className="h-full m-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={70} minSize={40}>
              <div className="p-6 h-full overflow-auto">
                <DataVisualizations 
                  visualizations={visualizations} 
                  isLoading={isAnalyzing} 
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30} minSize={25}>
              <div className="p-6 h-full">
                <InsightsPanel 
                  insights={insights} 
                  isLoading={isAnalyzing} 
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        
        <TabsContent value="chat" className="h-full m-0 p-6">
          <DataChat 
            processedData={processedData} 
            onGenerateVisualization={handleGenerateVisualization} 
          />
        </TabsContent>
      </div>
    </div>
  );
  
  return (
    <main className="min-h-screen bg-dataviz-background">
      {analyzedVariable ? renderAnalysisView() : renderInitialView()}
    </main>
  );
};

// Helper Components

interface StepIndicatorProps {
  number: number;
  status: "upcoming" | "current" | "complete";
  label: string;
}

const StepIndicator = ({ number, status, label }: StepIndicatorProps) => {
  const bgColor = 
    status === "complete" ? "bg-dataviz-teal text-white" :
    status === "current" ? "bg-white border-2 border-dataviz-teal text-dataviz-teal" :
    "bg-gray-100 text-gray-400";
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
        {number}
      </div>
      <span className={`text-sm ${status === "upcoming" ? "text-gray-400" : "text-gray-700"}`}>
        {label}
      </span>
    </div>
  );
};

const StepConnector = () => (
  <div className="flex-1 h-0.5 bg-gray-200" />
);

interface DataStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const DataStatCard = ({ icon, label, value }: DataStatCardProps) => (
  <div className="flex items-center gap-3 p-3 border rounded-md bg-card">
    <div className="p-2 bg-primary/10 rounded">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default Index;
