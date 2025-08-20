
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Basic health information
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: Deno.env.get("ENVIRONMENT") || "development"
    };

    return new Response(
      JSON.stringify(healthStatus),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: "unhealthy", 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500
      }
    );
  }
});
