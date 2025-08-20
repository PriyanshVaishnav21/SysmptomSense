
import { useState, useEffect } from "react";
import { HistoryDashboard } from "@/components/user/HistoryDashboard";
import { DiagnosisResult } from "@/types/health";
import { useToast } from "@/hooks/use-toast";
import { getUserHealthHistory, deleteHealthResult } from "@/services/healthService";
import { useAuth } from "@/contexts/AuthContext";
import { MainNavigation } from "@/components/layout/MainNavigation";

const History = () => {
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user) {
          // The getUserHealthHistory function now returns properly typed data
          const data = await getUserHealthHistory();
          setHistory(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch your health history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user, toast]);

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteHealthResult(id);
      setHistory(history.filter(item => item.id !== id));
      
      toast({
        title: "Record deleted",
        description: "The health record has been removed from your history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-health-light dark:bg-gray-900">
        <MainNavigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-pulse mb-4 h-8 w-32 bg-muted rounded mx-auto"></div>
              <div className="animate-pulse h-4 w-48 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-health-light dark:bg-gray-900">
      <MainNavigation />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <HistoryDashboard history={history} onDelete={handleDeleteRecord} />
      </div>
    </div>
  );
};

export default History;
