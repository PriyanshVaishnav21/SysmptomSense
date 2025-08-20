
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type FeedbackFormProps = {
  onSubmit: (isHelpful: boolean, comments: string) => void;
};

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isHelpful === null) {
      toast({
        title: "Please select an option",
        description: "Let us know if our service was helpful.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(isHelpful, comments);
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our service.",
      });
      setIsLoading(false);
      setIsHelpful(null);
      setComments("");
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-health-primary">Your Feedback</CardTitle>
        <CardDescription>
          Help us improve our service by sharing your experience
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Was the symptom checker helpful?</p>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={isHelpful === true ? "default" : "outline"}
                className={isHelpful === true ? "bg-health-primary" : ""}
                onClick={() => setIsHelpful(true)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes, it was helpful
              </Button>
              
              <Button
                type="button"
                variant={isHelpful === false ? "default" : "outline"}
                className={isHelpful === false ? "bg-health-primary" : ""}
                onClick={() => setIsHelpful(false)}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No, needs improvement
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Additional comments (optional)
            </label>
            <Textarea
              id="comments"
              placeholder="Share your thoughts on how we can improve..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-health-primary"
            disabled={isLoading || isHelpful === null}
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
