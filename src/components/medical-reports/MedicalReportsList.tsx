
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pill, PenLine, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MedicalReportForm } from './MedicalReportForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getMedicalReports,
  createMedicalReport,
  updateMedicalReport,
  deleteMedicalReport,
} from '@/services/medicalReportService';
import { MedicalReport } from '@/types/health';

export function MedicalReportsList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<MedicalReport | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['medicalReports'],
    queryFn: getMedicalReports,
  });
  
  const createMutation = useMutation({
    mutationFn: createMedicalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalReports'] });
      toast.success('Medical report added successfully');
    },
    onError: (error) => {
      toast.error('Error adding medical report: ' + (error as Error).message);
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      updateMedicalReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalReports'] });
      toast.success('Medical report updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating medical report: ' + (error as Error).message);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteMedicalReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalReports'] });
      toast.success('Medical report deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting medical report: ' + (error as Error).message);
    },
  });
  
  const handleAddReport = async (values: any) => {
    await createMutation.mutateAsync(values);
    setIsAddModalOpen(false);
  };
  
  const handleEditReport = async (values: any) => {
    if (!currentReport) return;
    
    await updateMutation.mutateAsync({
      id: currentReport.id,
      data: values,
    });
    
    setIsEditModalOpen(false);
    setCurrentReport(null);
  };
  
  const handleDelete = async () => {
    if (!currentReport) return;
    
    await deleteMutation.mutateAsync(currentReport.id);
    setIsDeleteAlertOpen(false);
    setCurrentReport(null);
  };
  
  const openEditModal = (report: MedicalReport) => {
    setCurrentReport(report);
    setIsEditModalOpen(true);
  };
  
  const openDeleteAlert = (report: MedicalReport) => {
    setCurrentReport(report);
    setIsDeleteAlertOpen(true);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading medical reports...</div>;
  }
  
  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Error loading medical reports</p>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Medical Reports</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>

      {reports && reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className={!report.active ? "opacity-80" : undefined}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {report.active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Inactive
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal(report)}>
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openDeleteAlert(report)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Condition</h4>
                    <p>{report.conditionName}</p>
                  </div>
                  
                  {report.medications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Medications</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.medications.map((med, i) => (
                          <Badge key={i} variant="secondary" className="flex items-center">
                            <Pill className="h-3 w-3 mr-1" />
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.description && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Notes</h4>
                      <p className="text-sm">{report.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                    <p className="text-sm">
                      From {format(new Date(report.startDate), 'MMM d, yyyy')}
                      {report.endDate ? 
                        ` to ${format(new Date(report.endDate), 'MMM d, yyyy')}` : 
                        ' - Ongoing'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <p className="mb-4">You haven't added any medical reports yet.</p>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Report</Button>
        </div>
      )}

      <MedicalReportForm
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddReport}
        mode="create"
      />
      
      {currentReport && (
        <MedicalReportForm
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditReport}
          initialData={currentReport}
          mode="edit"
        />
      )}
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your medical report 
              "{currentReport?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
