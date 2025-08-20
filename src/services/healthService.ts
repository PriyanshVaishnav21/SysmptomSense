import { apiFetch } from '@/lib/api';
import { DiagnosisResult, UserFeedback, SeverityLevel, PillAnalysisResult } from '@/types/health';

export const saveHealthResult = async (result: Omit<DiagnosisResult, 'id' | 'createdAt'>) => {
  try {
    const data = await apiFetch('/api/diagnosis', {
      method: 'POST',
      body: JSON.stringify({
        condition_name: result.conditionName,
        confidence_score: result.confidenceScore,
        description: result.description,
        severity: result.severity,
        advice: result.advice,
      }),
    });
    return data as any;
  } catch (error) {
    console.error('Error saving health result:', error);
    throw error;
  }
};

export const getUserHealthHistory = async () => {
  try {
    const data = await apiFetch<any[]>('/api/diagnosis');
    // Transform from snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      conditionName: item.condition_name,
      confidenceScore: item.confidence_score,
      description: item.description,
      severity: item.severity as SeverityLevel, // Cast to SeverityLevel
      advice: item.advice,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching health history:', error);
    throw error;
  }
};

export const deleteHealthResult = async (id: string) => {
  try {
    await apiFetch(`/api/diagnosis/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error deleting health result:', error);
    throw error;
  }
};

export const analyzePill = async (imageData: string): Promise<PillAnalysisResult> => {
  try {
    const data = await apiFetch<PillAnalysisResult>('/api/ai/analyze-pill', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    });
    return data;
  } catch (error) {
    console.error('Error analyzing pill:', error);
    throw error;
  }
};

export const analyzeSymptoms = async (
  symptoms: string[], 
  description: string,
  language: string = "english"
): Promise<DiagnosisResult[]> => {
  try {
    const data = await apiFetch<DiagnosisResult[]>('/api/ai/analyze-symptoms', {
      method: 'POST',
      body: JSON.stringify({ symptoms, description, language }),
    });
    return data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

export const analyzePillByName = async (pillName: string): Promise<PillAnalysisResult> => {
  try {
    const data = await apiFetch<PillAnalysisResult>('/api/ai/analyze-pill', {
      method: 'POST',
      body: JSON.stringify({ pillName }),
    });
    return data;
  } catch (error) {
    console.error('Error analyzing pill by name:', error);
    throw error;
  }
};

export const saveFeedback = async (feedback: Omit<UserFeedback, 'id' | 'createdAt'>) => {
  try {
    // Diagnosis IDs will be Mongo ObjectIds now
    const payload = {
      diagnosis_id: feedback.diagnosisId,
      is_helpful: feedback.isHelpful,
      comments: feedback.comments,
    };
    const data = await apiFetch('/api/diagnosis/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data as any;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

// Helper function to check if a string is a valid UUID
function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to generate a consistent UUID from a non-UUID string
function generateDummyUUID(str: string) {
  // Simple implementation to create a placeholder UUID
  // This creates a deterministic UUID-like string
  const prefix = '00000000-0000-0000-0000-';
  const suffix = str.padStart(12, '0').slice(-12);
  return prefix + suffix;
}
