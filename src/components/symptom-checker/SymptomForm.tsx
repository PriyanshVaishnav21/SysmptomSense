
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Symptom } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SymptomFormProps = {
  onSubmit: (symptoms: string[], description: string, language: string) => void;
  isLoading: boolean;
};

// Predefined common symptoms for demonstration
const PREDEFINED_SYMPTOMS: Symptom[] = [
  { id: "1", name: "Headache" },
  { id: "2", name: "Fever" },
  { id: "3", name: "Cough" },
  { id: "4", name: "Fatigue" },
  { id: "5", name: "Sore throat" },
  { id: "6", name: "Shortness of breath" },
  { id: "7", name: "Nausea" },
  { id: "8", name: "Dizziness" },
  { id: "9", name: "Joint pain" },
  { id: "10", name: "Chest pain" },
  { id: "11", name: "Back pain" },
  { id: "12", name: "Rash" },
  { id: "13", name: "Chills" },
  { id: "14", name: "Stomachache" },
  { id: "15", name: "Muscle ache" },
];

export function SymptomForm({ onSubmit, isLoading }: SymptomFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();

  const filteredSymptoms = PREDEFINED_SYMPTOMS.filter(
    (symptom) => 
      !selectedSymptoms.some(s => s.id === symptom.id) &&
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSymptom = (symptom: Symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setSearchTerm("");
  };

  const handleRemoveSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0 && description.trim() === "") {
      toast({
        title: "No symptoms provided",
        description: "Please select symptoms or describe how you're feeling.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(
      selectedSymptoms.map(s => s.name),
      description,
      language
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-health-primary">Symptom Checker</CardTitle>
        <CardDescription>
          Select your symptoms or describe how you're feeling for an AI-powered health assessment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="symptoms">Select Symptoms</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="symptoms"
                placeholder="Type to search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {searchTerm && filteredSymptoms.length > 0 && (
              <Card className="absolute z-10 w-full max-w-[calc(100%-2rem)] mt-1 shadow-lg">
                <ScrollArea className="h-auto max-h-60">
                  <div className="p-2">
                    {filteredSymptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="px-2 py-1.5 cursor-pointer hover:bg-muted rounded-md"
                        onClick={() => handleSelectSymptom(symptom)}
                      >
                        {symptom.name}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}

            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSymptoms.map((symptom) => (
                  <Badge
                    key={symptom.id}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {symptom.name}
                    <button
                      type="button"
                      className="ml-2 text-xs"
                      onClick={() => handleRemoveSymptom(symptom.id)}
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">How are you feeling today?</Label>
            <Textarea
              id="description"
              placeholder="Describe your symptoms in detail in English, Hindi, or Hinglish (e.g., सिरदर्द तीन दिनों से है और मुझे थकान महसूस हो रही है)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="language">Preferred Response Language</Label>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="hinglish">Hinglish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full font-medium bg-health-primary"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing symptoms..." : "Check Symptoms"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
