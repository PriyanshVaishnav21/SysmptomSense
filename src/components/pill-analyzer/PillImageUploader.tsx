
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Search, Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

type PillImageUploaderProps = {
  onAnalyze: (file: File | null, pillName?: string) => void;
  isLoading: boolean;
};

export function PillImageUploader({ onAnalyze, isLoading }: PillImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pillName, setPillName] = useState("");
  const [activeTab, setActiveTab] = useState("image");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check if file size is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check if file size is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image of a pill or medication",
        variant: "destructive",
      });
      return;
    }

    onAnalyze(selectedFile);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pillName.trim()) {
      toast({
        title: "No medication name provided",
        description: "Please enter the name of the pill or medication",
        variant: "destructive",
      });
      return;
    }

    onAnalyze(null, pillName);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset state when changing tabs
    if (value === "image") {
      setPillName("");
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-health-primary">Pill/Medicine Analyzer</CardTitle>
        <CardDescription>
          Upload an image or enter the name of a pill or medication to identify it and learn about its usage with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Image Upload
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Text Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image">
            <form onSubmit={handleImageSubmit}>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Pill preview"
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBrowseClick}
                      disabled={isLoading}
                    >
                      Choose a different image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your image here, or{" "}
                        <button
                          type="button"
                          className="text-health-primary hover:underline"
                          onClick={handleBrowseClick}
                          disabled={isLoading}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For best results, use a clear image with good lighting
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <CardFooter className="px-0 pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-health-primary"
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Analyzing with AI...
                    </>
                  ) : (
                    "Identify Medication from Image"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="text">
            <form onSubmit={handleTextSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Pill className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <label htmlFor="pillName" className="text-sm font-medium">
                    Enter Medication Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pillName"
                      placeholder="E.g., Aspirin, Paracetamol, Metformin..."
                      value={pillName}
                      onChange={(e) => setPillName(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the exact name printed on the medication for best results
                  </p>
                </div>
              </div>
              
              <CardFooter className="px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-health-primary"
                  disabled={!pillName.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Analyzing with AI...
                    </>
                  ) : (
                    "Identify Medication by Name"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
