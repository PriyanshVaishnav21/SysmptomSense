
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PillAnalysisResult as PillResult } from "@/types/health";
import { AlertTriangle } from "lucide-react";

type PillAnalysisResultProps = {
  result: PillResult;
  onReset: () => void;
};

export function PillAnalysisResult({ result, onReset }: PillAnalysisResultProps) {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-health-primary">{result.name}</CardTitle>
        <CardDescription>
          Pill identification and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {result.imageUrl && (
            <div className="w-full sm:w-1/3">
              <img
                src={result.imageUrl}
                alt={result.name}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="w-full sm:w-2/3 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-health-primary">Purpose</h3>
              <p className="text-sm">{result.purpose}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-health-primary">Recommended Dosage</h3>
              <p className="text-sm">{result.dosage}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-health-primary">Instructions</h3>
              <p className="text-sm">{result.instructions}</p>
            </div>
            
            {result.warnings.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-health-severe flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings
                </h3>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Important Note</p>
          <p className="text-xs text-muted-foreground">
            This information is provided for educational purposes only and is not a substitute for professional medical advice.
            Always consult your healthcare provider before starting any medication.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onReset} 
          className="w-full bg-health-primary"
        >
          Analyze Another Pill
        </Button>
      </CardFooter>
    </Card>
  );
}
