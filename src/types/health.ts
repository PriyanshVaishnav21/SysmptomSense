
export type Symptom = {
  id: string;
  name: string;
  description?: string;
};

export type SeverityLevel = "mild" | "moderate" | "severe";

export type DiagnosisResult = {
  id: string;
  conditionName: string;
  confidenceScore: number; // 0-100
  description: string;
  severity: SeverityLevel;
  advice: string;
  createdAt: Date | string;
};

export type UserFeedback = {
  id: string;
  diagnosisId: string;
  isHelpful: boolean;
  comments?: string;
  createdAt: Date | string;
};

export type PillAnalysisResult = {
  name: string;
  purpose: string;
  dosage: string;
  instructions: string;
  warnings: string[];
  imageUrl?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date | string;
};

export type MedicalReport = {
  id: string;
  userId: string;
  title: string;
  conditionName: string;
  medications: string[];
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};
