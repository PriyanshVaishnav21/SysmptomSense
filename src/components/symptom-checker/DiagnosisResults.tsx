
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiagnosisResult, SeverityLevel } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ThumbsDown, ThumbsUp, Pill, Info, Heart, Activity, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DiagnosisResultsProps = {
  results: DiagnosisResult[];
  onSave: () => void;
  onFeedback: (diagnosisId: string, isHelpful: boolean) => void;
  onReset: () => void;
};

export function DiagnosisResults({ results, onSave, onFeedback, onReset }: DiagnosisResultsProps) {
  // Find the highest severity level among all results
  const highestSeverity = results.reduce((highest, result) => {
    const severityOrder: Record<SeverityLevel, number> = {
      mild: 1,
      moderate: 2,
      severe: 3
    };
    
    return severityOrder[result.severity] > severityOrder[highest] 
      ? result.severity 
      : highest;
  }, "mild" as SeverityLevel);

  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case "mild": return "bg-health-mild";
      case "moderate": return "bg-health-moderate";
      case "severe": return "bg-health-severe";
      default: return "bg-health-mild";
    }
  };

  const getSeverityTextClass = (severity: SeverityLevel): string => {
    switch (severity) {
      case "mild": return "text-health-mild";
      case "moderate": return "text-health-moderate";
      case "severe": return "text-health-severe";
      default: return "text-health-mild";
    }
  };

  // Sort results by confidence score (highest first)
  const sortedResults = [...results].sort((a, b) => b.confidenceScore - a.confidenceScore);

  // Enhanced mock data for additional disease details including medicines
  const getDetailedInfo = (conditionName: string, severity: SeverityLevel) => {
    const detailedInfo = {
      causes: [
        "Genetic factors",
        "Environmental triggers",
        "Lifestyle choices such as diet and exercise",
        "Pre-existing medical conditions"
      ],
      treatments: [
        severity === "severe" ? "Immediate medical attention" : "Rest and hydration",
        severity === "mild" ? "Over-the-counter pain relievers" : "Prescription medication",
        "Lifestyle adjustments",
        "Regular monitoring"
      ],
      suggestedMedicines: [
        {
          name: severity === "severe" ? "Prescribed medication (consult doctor)" : "Paracetamol/Acetaminophen",
          dosage: severity === "severe" ? "As prescribed by doctor" : "500mg every 6-8 hours",
          frequency: severity === "severe" ? "As directed" : "Maximum 4 times daily",
          type: severity === "severe" ? "Prescription" : "Over-the-counter",
          purpose: "Pain relief and fever reduction"
        },
        {
          name: severity === "mild" ? "Ibuprofen" : "Doctor-prescribed anti-inflammatory",
          dosage: severity === "mild" ? "200-400mg" : "As prescribed",
          frequency: severity === "mild" ? "Every 6-8 hours with food" : "As directed by physician",
          type: severity === "mild" ? "Over-the-counter" : "Prescription",
          purpose: "Inflammation and pain reduction"
        }
      ],
      selfCare: [
        "Maintain proper hydration",
        "Ensure adequate rest",
        "Monitor symptoms for changes",
        "Follow dietary recommendations"
      ]
    };
    
    return detailedInfo;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Medical Disclaimer Alert */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-700">
        <Shield className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">Important Medical Disclaimer</AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          This analysis is for informational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider before taking any medication or making health decisions.
        </AlertDescription>
      </Alert>

      {highestSeverity === "severe" && (
        <Alert className="border-health-severe bg-red-50 dark:bg-red-950 dark:border-red-700">
          <AlertTriangle className="h-5 w-5 text-health-severe" />
          <AlertTitle className="text-health-severe font-bold">Urgent Medical Attention Advised</AlertTitle>
          <AlertDescription>
            Our analysis suggests your symptoms may require immediate medical attention.
            Please contact emergency services or visit your nearest emergency room.
          </AlertDescription>
        </Alert>
      )}

      {highestSeverity === "moderate" && (
        <Alert className="border-health-moderate bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700">
          <AlertTriangle className="h-5 w-5 text-health-moderate" />
          <AlertTitle className="text-health-moderate font-bold">Medical Consultation Recommended</AlertTitle>
          <AlertDescription>
            Based on your symptoms, we recommend consulting a healthcare professional within the next 24-48 hours.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-health-primary dark:text-health-secondary">Possible Conditions</CardTitle>
          <CardDescription>
            Based on your symptoms, these are potential conditions to consider. 
            This is not a diagnosis and should not replace professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedResults.map((result) => {
            const detailedInfo = getDetailedInfo(result.conditionName, result.severity);
            
            return (
              <div key={result.id} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{result.conditionName}</h3>
                  <Badge className={`${getSeverityColor(result.severity)} text-white`}>
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">{result.confidenceScore}%</span>
                  </div>
                  <Progress value={result.confidenceScore} max={100} className="h-2" />
                </div>
                
                <p className="text-sm text-muted-foreground">{result.description}</p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="detailed-information">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <Info className="h-4 w-4" />
                        Detailed Information & Suggested Medicines
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <h4 className="font-semibold">Possible Causes</h4>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {detailedInfo.causes.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <h4 className="font-semibold">Recommended Treatments</h4>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {detailedInfo.treatments.map((treatment, i) => (
                            <li key={i}>{treatment}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Pill className="h-4 w-4 text-green-500" />
                          <h4 className="font-semibold">Suggested Medicines</h4>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md mb-3">
                          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            ⚠️ IMPORTANT: These are general suggestions only. Always consult with a doctor or pharmacist before taking any medication. Dosages may vary based on your individual health condition, age, weight, and other medications you may be taking.
                          </p>
                        </div>
                        {detailedInfo.suggestedMedicines.map((medication, i) => (
                          <div key={i} className="ml-5 p-3 bg-muted/30 rounded-md border-l-4 border-green-500">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-green-700 dark:text-green-300">{medication.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {medication.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              <strong>Purpose:</strong> {medication.purpose}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              <strong>Suggested Dosage:</strong> {medication.dosage}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Frequency:</strong> {medication.frequency}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-red-500" />
                          <h4 className="font-semibold">Self-Care Recommendations</h4>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {detailedInfo.selfCare.map((care, i) => (
                            <li key={i}>{care}</li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Separator className="my-2" />
                
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${getSeverityTextClass(result.severity)}`}>
                    Medical Advice:
                  </h4>
                  <p className="text-sm">{result.advice}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => onFeedback(result.id, true)}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => onFeedback(result.id, false)}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" /> Not Helpful
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Check New Symptoms
          </Button>
          <Button onClick={onSave} className="bg-health-primary dark:bg-health-secondary">
            Save Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
