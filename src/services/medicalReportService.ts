import { apiFetch } from '@/lib/api';
import { MedicalReport } from '@/types/health';

export const getMedicalReports = async (): Promise<MedicalReport[]> => {
  try {
    const data = await apiFetch<any[]>(`/api/reports`);
    return data.map(item => ({
      id: item.id,
      userId: item.user_id || item.userId,
      title: item.title,
      conditionName: item.condition_name,
      medications: item.medications,
      description: item.description,
      startDate: item.start_date,
      endDate: item.end_date,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    throw error;
  }
};

export const createMedicalReport = async (report: Omit<MedicalReport, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<MedicalReport> => {
  try {
    const start_date = typeof report.startDate === 'object' 
      ? (report.startDate as Date).toISOString() 
      : (report.startDate as any);
    const end_date = report.endDate 
      ? (typeof report.endDate === 'object' 
          ? (report.endDate as Date).toISOString() 
          : (report.endDate as any)) 
      : null;
    const data = await apiFetch<any>(`/api/reports`, {
      method: 'POST',
      body: JSON.stringify({
        title: report.title,
        condition_name: report.conditionName,
        medications: report.medications,
        description: report.description,
        start_date,
        end_date,
        active: report.active,
      }),
    });
    return {
      id: data.id || data._id,
      userId: data.user_id || data.userId,
      title: data.title,
      conditionName: data.condition_name,
      medications: data.medications,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating medical report:', error);
    throw error;
  }
};

export const updateMedicalReport = async (id: string, report: Partial<Omit<MedicalReport, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<MedicalReport> => {
  try {
    const updateData: any = {};
    
    if (report.title !== undefined) updateData.title = report.title;
    if (report.conditionName !== undefined) updateData.condition_name = report.conditionName;
    if (report.medications !== undefined) updateData.medications = report.medications;
    if (report.description !== undefined) updateData.description = report.description;
    if (report.startDate !== undefined) {
      updateData.start_date = typeof report.startDate === 'object'
        ? (report.startDate as Date).toISOString()
        : report.startDate;
    }
    if (report.endDate !== undefined) {
      updateData.end_date = report.endDate && typeof report.endDate === 'object'
        ? (report.endDate as Date).toISOString()
        : report.endDate;
    }
    if (report.active !== undefined) updateData.active = report.active;
    
    updateData.updated_at = new Date().toISOString();
    const data = await apiFetch<any>(`/api/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return {
      id: data.id || data._id,
      userId: data.user_id || data.userId,
      title: data.title,
      conditionName: data.condition_name,
      medications: data.medications,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating medical report:', error);
    throw error;
  }
};

export const deleteMedicalReport = async (id: string): Promise<boolean> => {
  try {
    await apiFetch(`/api/reports/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error deleting medical report:', error);
    throw error;
  }
};
