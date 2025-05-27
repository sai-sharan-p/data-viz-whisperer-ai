import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Brain, FileBarChart, Database, FileText, ChevronLeft, BarChart, MessageCircle, LayoutDashboard, ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import FileUploader from "@/components/FileUploader";
import VariableSelector from "@/components/VariableSelector";
import DataVisualizations from "@/components/DataVisualizations";
import InsightsPanel from "@/components/InsightsPanel";
import DataChat from "@/components/DataChat";
import VisualizationBuilder from "@/components/VisualizationBuilder";
import DataTable from "@/components/DataTable";
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
  const [activeTab, setActiveTab] = useState<"trends" | "chat" | "builder">("trends");
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setProcessedData(null);
      setSelectedVariable(null);
      setAnalyzedVariable(null);
      setVisualizations([]);
      setInsights([]);
      setError(null);
      
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
    setError(null);
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
    setError(null);
    
    try {
      console.log("Analyzing data for variable:", selectedVariable);
      const result = analyzeDataset(processedData, selectedVariable);
      console.log("Analysis result:", result);
      
      if (result.visualizations.length === 0 && result.insights.length === 0) {
        setError("No visualizations or insights could be generated for this variable. Try selecting a different variable.");
        toast({
          title: "Analysis returned no results",
          description: "No visualizations or insights could be generated for this variable.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }
      
      setVisualizations(result.visualizations);
      setInsights(result.insights);
      setAnalyzedVariable(selectedVariable);
      
      toast({
        title: "Analysis complete",
        description: `Generated ${result.visualizations.length} visualizations and ${result.insights.length} insights.`,
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred during analysis");
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
    setVisualizations(prev => [visualization, ...prev]);
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
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <FileBarChart className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">FinFlow Analytics</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your financial data, select variables to analyze, and discover insights through powerful visualizations.
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
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dataset Preview</h3>
              <div className="overflow-x-auto">
                <DataTable processedData={processedData} />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <VariableSelector 
                processedData={processedData} 
                onSelectVariable={handleSelectVariable} 
                selectedVariable={selectedVariable}
                onAnalyze={handleAnalyzeData}
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
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
  const renderAnalysisView = () => (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setAnalyzedVariable(null);
              setVisualizations([]);
              setInsights([]);
              setError(null);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">FinFlow Analysis: {analyzedVariable}</h1>
          <Badge variant="outline" className="ml-2">
            {processedData?.summary.numericColumns.includes(analyzedVariable || "") 
              ? "Numeric" 
              : processedData?.summary.dateColumns.includes(analyzedVariable || "")
                ? "Date"
                : "Categorical"}
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "trends" | "chat" | "builder")}>
          <TabsList>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends & Insights
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Data Chat
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Visualization Builder
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="trends" className="h-full m-0">
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

          <TabsContent value="builder" className="h-full m-0 p-6">
            <VisualizationBuilder 
              processedData={processedData} 
              onGenerateVisualization={handleGenerateVisualization} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  
  return (
    <main className="min-h-screen bg-slate-50">
      {analyzedVariable ? renderAnalysisView() : renderInitialView()}
    </main>
  );
};

interface StepIndicatorProps {
  number: number;
  status: "upcoming" | "current" | "complete";
  label: string;
}

const StepIndicator = ({ number, status, label }: StepIndicatorProps) => {
  const bgColor = 
    status === "complete" ? "bg-blue-600 text-white" :
    status === "current" ? "bg-white border-2 border-blue-600 text-blue-600" :
    "bg-gray-100 text-gray-400";
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
        {number}
      </div>
      <span className={`text-sm ${status === "upcoming" ? "text-gray-400" : "text-slate-700"}`}>
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
