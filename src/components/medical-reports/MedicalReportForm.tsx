
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MedicalReport } from '@/types/health';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  conditionName: z.string().min(2, {
    message: 'Condition name must be at least 2 characters.',
  }),
  medications: z.array(z.string()),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'A start date is required.',
  }),
  endDate: z.date().optional(),
  active: z.boolean().default(true),
});

type MedicalReportFormValues = z.infer<typeof formSchema>;

interface MedicalReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MedicalReportFormValues) => Promise<void>;
  initialData?: MedicalReport;
  mode?: 'create' | 'edit';
}

export function MedicalReportForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create',
}: MedicalReportFormProps) {
  const [newMedication, setNewMedication] = useState('');

  const defaultValues: Partial<MedicalReportFormValues> = {
    title: initialData?.title || '',
    conditionName: initialData?.conditionName || '',
    medications: initialData?.medications || [],
    description: initialData?.description || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    active: initialData?.active !== undefined ? initialData.active : true,
  };

  const form = useForm<MedicalReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleAddMedication = () => {
    if (newMedication.trim() === '') return;
    
    const currentMedications = form.getValues('medications') || [];
    form.setValue('medications', [...currentMedications, newMedication.trim()]);
    setNewMedication('');
  };

  const handleRemoveMedication = (index: number) => {
    const currentMedications = form.getValues('medications') || [];
    form.setValue('medications', currentMedications.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (values: MedicalReportFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Medical Report' : 'Edit Medical Report'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new medical report with your current condition and medications.'
              : 'Update your medical report information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Checkup, Cardiology Visit" {...field} />
                  </FormControl>
                  <FormDescription>A short title for this medical report</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conditionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hypertension, Diabetes" {...field} />
                  </FormControl>
                  <FormDescription>The name of your current medical condition</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={() => (
                <FormItem>
                  <FormLabel>Medications</FormLabel>
                  <div className="flex gap-2 items-end mb-2">
                    <Input
                      placeholder="e.g., Metformin 500mg"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddMedication}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch('medications')?.map((med, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3">
                        {med}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>List all medications you are currently taking</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Additional details about your medical condition"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Optional details about this condition</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "min-w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the condition was first diagnosed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "min-w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Leave empty if ongoing</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues('startDate');
                            return startDate && date < startDate;
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the condition ended (if applicable)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Active condition</FormLabel>
                    <FormDescription className="text-xs">
                      Check if this is a current ongoing condition
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
