
import { DiagnosisResult, PillAnalysisResult } from "@/types/health";

const getRandomId = () => Math.random().toString(36).substring(2, 15);

// Mock function to simulate API call for diagnosis
export const getMockDiagnosis = (symptoms: string[], description: string): Promise<DiagnosisResult[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const now = new Date();
      
      // Simple logic to determine potential conditions based on symptoms
      let mockResults: DiagnosisResult[] = [];
      
      if (symptoms.includes("Headache")) {
        mockResults.push({
          id: getRandomId(),
          conditionName: "Tension headache",
          confidenceScore: 85,
          description: "Tension headaches are the most common type of headache and can cause mild to moderate pain in your head, neck, and behind your eyes.",
          severity: "mild",
          advice: "Rest in a quiet, dark room. Try over-the-counter pain relievers like acetaminophen or ibuprofen. Apply a cold compress to your forehead.",
          createdAt: now
        });
        
        mockResults.push({
          id: getRandomId(),
          conditionName: "Migraine",
          confidenceScore: 65,
          description: "Migraines are intense headaches that can cause throbbing pain, typically on one side of the head.",
          severity: "moderate",
          advice: "Rest in a quiet, dark room. Take prescribed migraine medication if available. Consider preventive treatments for recurring migraines.",
          createdAt: now
        });
      }
      
      if (symptoms.includes("Fever") || description.toLowerCase().includes("fever")) {
        mockResults.push({
          id: getRandomId(),
          conditionName: "Common cold",
          confidenceScore: 75,
          description: "A viral infection of the upper respiratory tract, including the nose and throat.",
          severity: "mild",
          advice: "Get plenty of rest. Stay hydrated. Use over-the-counter fever reducers like acetaminophen or ibuprofen.",
          createdAt: now
        });
        
        mockResults.push({
          id: getRandomId(),
          conditionName: "Influenza",
          confidenceScore: 60,
          description: "Flu is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.",
          severity: "moderate",
          advice: "Rest and drink plenty of fluids. Take over-the-counter medications to relieve symptoms. Consult a doctor if symptoms persist or worsen.",
          createdAt: now
        });
      }
      
      if (symptoms.includes("Cough") || description.toLowerCase().includes("cough")) {
        mockResults.push({
          id: getRandomId(),
          conditionName: "Acute bronchitis",
          confidenceScore: 70,
          description: "Inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.",
          severity: "mild",
          advice: "Rest and drink plenty of fluids. Use over-the-counter cough medications. Use a humidifier to add moisture to the air.",
          createdAt: now
        });
      }
      
      if (symptoms.includes("Chest pain") || description.toLowerCase().includes("chest pain")) {
        mockResults.push({
          id: getRandomId(),
          conditionName: "Possible angina",
          confidenceScore: 55,
          description: "Angina is chest pain caused by reduced blood flow to the heart muscles.",
          severity: "severe",
          advice: "Seek immediate medical attention. This could be a sign of a serious heart condition that requires prompt evaluation.",
          createdAt: now
        });
      }
      
      // If no specific conditions are identified, provide general possibilities
      if (mockResults.length === 0) {
        mockResults = [
          {
            id: getRandomId(),
            conditionName: "Minor viral infection",
            confidenceScore: 60,
            description: "A common viral infection that affects the upper respiratory system or digestive tract.",
            severity: "mild",
            advice: "Rest and stay hydrated. Monitor your symptoms and consult a doctor if they worsen or persist beyond a few days.",
            createdAt: now
          },
          {
            id: getRandomId(),
            conditionName: "Seasonal allergies",
            confidenceScore: 55,
            description: "An allergic response to seasonal environmental triggers like pollen or mold.",
            severity: "mild",
            advice: "Try over-the-counter antihistamines. Avoid known allergens when possible. Use a saline nasal rinse to clear irritants.",
            createdAt: now
          }
        ];
      }
      
      resolve(mockResults);
    }, 2000); // 2 second delay to simulate API call
  });
};

// Mock function to simulate API call for pill analysis
export const getMockPillAnalysis = (imageFile: File): Promise<PillAnalysisResult> => {
  return new Promise((resolve) => {
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Simulate API delay
    setTimeout(() => {
      // Return a mock result (in a real app, this would come from AI analysis)
      resolve({
        name: "Acetaminophen (500mg)",
        purpose: "Used for the temporary relief of minor aches and pains and to reduce fever.",
        dosage: "Adults and children 12 years and over: Take 2 tablets every 4 to 6 hours as needed. Do not exceed 6 tablets in 24 hours.",
        instructions: "Take with a full glass of water. May be taken with or without food.",
        warnings: [
          "Do not use with other medicines containing acetaminophen",
          "Alcohol warning: If you consume 3 or more alcoholic drinks every day, ask your doctor whether you should take this product",
          "Do not use for pain for more than 10 days unless directed by a doctor",
        ],
        imageUrl: imageUrl
      });
    }, 3000); // 3 second delay to simulate AI processing
  });
};
