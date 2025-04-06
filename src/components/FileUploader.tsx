
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileType, FileUp } from "lucide-react";
import { useState, useRef } from "react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader = ({ onFileUpload, isProcessing }: FileUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const validateAndUploadFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      toast({
        title: "Invalid file",
        description: "Could not determine file type",
        variant: "destructive"
      });
      return;
    }
    
    if (!['csv', 'xlsx', 'xls', 'xlsm'].includes(fileExtension)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }
    
    setFileName(file.name);
    onFileUpload(file);
    
    toast({
      title: "File uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`w-full ${dragActive ? 'border-primary border-2' : ''}`}>
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {!fileName ? (
            <>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold">Upload your dataset</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your CSV or Excel file, or click to browse
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                    <FileType className="h-3 w-3" />
                    <span>CSV</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                    <FileType className="h-3 w-3" />
                    <span>XLSX</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                    <FileType className="h-3 w-3" />
                    <span>XLS</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {isProcessing ? "Processing..." : "File uploaded successfully"}
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.xlsm"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          
          <Button 
            onClick={handleButtonClick} 
            disabled={isProcessing}
            variant={fileName ? "outline" : "default"}
            className="mt-2"
          >
            {fileName ? "Change File" : "Select File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
