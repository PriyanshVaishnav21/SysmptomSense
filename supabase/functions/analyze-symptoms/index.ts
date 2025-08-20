
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

// Define types directly in the edge function instead of importing
type SeverityLevel = "mild" | "moderate" | "severe";

type DiagnosisResult = {
  id: string;
  conditionName: string;
  confidenceScore: number; // 0-100
  description: string;
  severity: SeverityLevel;
  advice: string;
  createdAt: Date | string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { symptoms, description, language = "english" } = await req.json();
    
    if (!symptoms && !description) {
      throw new Error('Either symptoms or description is required');
    }

    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Prepare the prompt for OpenAI
    const symptomsText = Array.isArray(symptoms) && symptoms.length > 0 
      ? `Symptoms reported: ${symptoms.join(', ')}. ` 
      : '';
    
    const descriptionText = description 
      ? `Patient description: ${description}. ` 
      : '';

    console.log(`Analyzing symptoms: ${symptomsText}${descriptionText} in language: ${language}`);

    // Enhanced prompt to ensure more accurate medical analysis with language support
    const systemPrompt = `
      You are an AI medical assistant that analyzes symptoms to suggest possible conditions.
      For each condition, provide a detailed diagnosis including:
      - condition name (be specific with medical terminology)
      - confidence score (1-100 based on how well symptoms match)
      - severity (mild, moderate, or severe)
      - detailed description of the condition
      - specific medical advice
      
      Structure your response as a JSON object with a 'conditions' array containing objects with these fields:
      - conditionName (string)
      - confidenceScore (number between 1-100)
      - severity (string: either "mild", "moderate", or "severe")
      - description (string)
      - advice (string)
      
      Give 2-3 possible conditions based on the symptoms, from most to least likely.
      Be thorough and clinically accurate in your analysis.
      
      Important: If the input is in Hindi or Hinglish (mix of Hindi and English), detect it and provide your response in the same language.
      Your advice should be culturally appropriate for Indian patients when responding in Hindi/Hinglish.
      
      ONLY return valid JSON. Do not include any explanatory text outside the JSON structure.
    `;

    // Analyze the symptoms using OpenAI's GPT model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `${symptomsText}${descriptionText}Please analyze these symptoms and provide possible conditions. Respond in the same language as the input (Hindi, Hinglish, or English).`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // Lower temperature for more predictable, medically-focused responses
    });
    
    // Extract the analysis result
    const analysisContent = response.choices[0].message.content;
    console.log("Raw OpenAI response:", analysisContent);
    
    let analysisResults;
    
    try {
      // First, try to parse the response as JSON
      analysisResults = JSON.parse(analysisContent);
      
      // Check if the conditions array exists and is properly structured
      if (!analysisResults.conditions || !Array.isArray(analysisResults.conditions)) {
        // If not in expected format, try to restructure it
        if (Array.isArray(analysisResults)) {
          // If the result is directly an array, use it
          analysisResults = { conditions: analysisResults };
        } else {
          // Look for any array in the response that might contain conditions
          const possibleConditionsArray = Object.values(analysisResults).find(
            value => Array.isArray(value) && value.length > 0 && 
            value[0].conditionName && value[0].severity
          );
          
          if (possibleConditionsArray) {
            analysisResults = { conditions: possibleConditionsArray };
          } else {
            // Create a default structure if we can't find valid conditions
            analysisResults = { 
              conditions: [
                {
                  conditionName: "Unknown condition",
                  confidenceScore: 50,
                  severity: "moderate",
                  description: "Could not properly analyze the provided symptoms.",
                  advice: language.includes("hindi") ? 
                    "कृपया एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।" : 
                    "Please consult with a healthcare professional."
                }
              ]
            };
          }
        }
      }
      
      // Validate that each condition has the required fields
      analysisResults.conditions = analysisResults.conditions.map(condition => {
        // Ensure all required fields are present
        return {
          conditionName: condition.conditionName || "Unknown condition",
          confidenceScore: typeof condition.confidenceScore === 'number' ? 
            condition.confidenceScore : 50,
          severity: ['mild', 'moderate', 'severe'].includes(condition.severity) ? 
            condition.severity : "moderate",
          description: condition.description || 
            "No detailed description available for this condition.",
          advice: condition.advice || "Please consult with a healthcare professional."
        };
      });
      
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      console.log('Raw response content:', analysisContent);
      
      // Instead of throwing, return a fallback diagnosis
      analysisResults = { 
        conditions: [
          {
            conditionName: "Analysis Failed",
            confidenceScore: 0,
            severity: "moderate",
            description: language.includes("hindi") ? 
              "हमारी प्रणाली आपके लक्षणों का विश्लेषण करने में त्रुटि का सामना कर रही है।" : 
              "Our system encountered an error analyzing your symptoms.",
            advice: language.includes("hindi") ? 
              "कृपया फिर से प्रयास करें या स्वास्थ्य देखभाल पेशेवर से परामर्श करें।" : 
              "Please try again or consult with a healthcare professional."
          }
        ]
      };
    }

    // Add IDs and timestamps to each result
    const now = new Date();
    const diagnosisResults = analysisResults.conditions.map(condition => ({
      ...condition,
      id: crypto.randomUUID(),
      createdAt: now,
    }));
    
    console.log("Symptom analysis completed successfully");
    
    return new Response(JSON.stringify(diagnosisResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error analyzing symptoms:", error.message);
    
    return new Response(JSON.stringify({ 
      error: "Failed to analyze symptoms", 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
