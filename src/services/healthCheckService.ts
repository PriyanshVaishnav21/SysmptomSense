import { apiFetch } from "@/lib/api";

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  environment: string;
  error?: string;
}

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const data = await apiFetch<HealthStatus>('/api/health');
    return data;
  } catch (error) {
    console.error('Health check exception:', error);
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: "unknown",
      environment: "unknown",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
