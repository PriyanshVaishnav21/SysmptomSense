
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosisResult } from "@/types/health";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type HistoryDashboardProps = {
  history: DiagnosisResult[];
  onDelete: (id: string) => void;
};

export function HistoryDashboard({ history, onDelete }: HistoryDashboardProps) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResult | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenDetails = (diagnosis: DiagnosisResult) => {
    setSelectedDiagnosis(diagnosis);
  };

  const handleCloseDetails = () => {
    setSelectedDiagnosis(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-health-mild text-white";
      case "moderate": return "bg-health-moderate text-white";
      case "severe": return "bg-health-severe text-white";
      default: return "bg-health-mild text-white";
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;  // Sort by most recent first
  });

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-health-primary">Your Health History</CardTitle>
          <CardDescription>
            View your past symptom checks and diagnoses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your health history will appear here after you use the symptom checker.</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Your recent health checks</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="hidden sm:table-cell">Confidence</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell className="font-medium">
                      {typeof diagnosis.createdAt === 'string' 
                        ? format(new Date(diagnosis.createdAt), 'MMM d, yyyy') 
                        : format(diagnosis.createdAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{diagnosis.conditionName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{diagnosis.confidenceScore}%</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(diagnosis.severity)}>
                        {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDetails(diagnosis)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDeleteId(diagnosis.id)}
                        className="text-health-severe border-health-severe hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedDiagnosis} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedDiagnosis?.conditionName}</DialogTitle>
            <DialogDescription>
              Recorded on {selectedDiagnosis && (typeof selectedDiagnosis.createdAt === 'string' 
                ? format(new Date(selectedDiagnosis.createdAt), 'MMMM d, yyyy') 
                : format(selectedDiagnosis.createdAt, 'MMMM d, yyyy'))}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Confidence Level</h4>
              <p>{selectedDiagnosis?.confidenceScore}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p>{selectedDiagnosis?.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Recommended Advice</h4>
              <p>{selectedDiagnosis?.advice}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this health record from your history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-health-severe text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
