
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkHealth, HealthStatus } from "@/services/healthCheckService";
import { API_BASE } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HealthCheck = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHealthStatus = async () => {
    setLoading(true);
    try {
      const status = await checkHealth();
      setHealth(status);
    } catch (error) {
      toast({
        title: "Error checking health",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Health Check</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>System Health Status</CardTitle>
          <CardDescription>Current health information for the application</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : health ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-semibold w-32">Status:</span>
                <Badge className={health.status === "healthy" ? "bg-green-500" : "bg-red-500"}>
                  {health.status}
                </Badge>
              </div>
              <div>
                <span className="font-semibold w-32">Timestamp:</span>
                <span>{health.timestamp}</span>
              </div>
              <div>
                <span className="font-semibold w-32">Version:</span>
                <span>{health.version}</span>
              </div>
              <div>
                <span className="font-semibold w-32">Environment:</span>
                <span>{health.environment}</span>
              </div>
              {health.error && (
                <div>
                  <span className="font-semibold w-32">Error:</span>
                  <span className="text-red-500">{health.error}</span>
                </div>
              )}
            </div>
          ) : (
            <p>No health data available</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={fetchHealthStatus} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Refresh Health Status"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access Information</CardTitle>
          <CardDescription>How to access the health check API directly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Local Development</h3>
              <p className="mt-1 text-sm text-gray-500">
                When running locally, access the health check API at:
              </p>
              <code className="mt-2 block rounded bg-gray-100 p-2 text-sm">
                http://localhost:4000/api/health
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Configured Base URL</h3>
              <p className="mt-1 text-sm text-gray-500">
                Based on your configured API base, the health endpoint resolves to:
              </p>
              <code className="mt-2 block rounded bg-gray-100 p-2 text-sm">
                {`${API_BASE}/api/health`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCheck;
