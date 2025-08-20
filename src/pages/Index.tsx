import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainNavigation } from "@/components/layout/MainNavigation";
import { HealthAdvisory } from "@/components/layout/HealthAdvisory";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, userName, signOut } = useAuth();
  const isAuthenticated = !!user;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-health-light dark:bg-gray-900">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-health-primary/10 to-health-secondary/5 dark:from-health-primary/5 dark:to-health-secondary/5 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <img 
                  src="/lovable-uploads/0c1f69d9-8fbe-47ee-8b5c-83db03030f36.png" 
                  alt="SymptomSense Logo" 
                  className="h-36 mb-6"
                />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-health-dark dark:text-white text-center">
                  AI-Powered Health Symptom Checker
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 text-center">
                  Get quick insights about your symptoms and receive personalized health advice using artificial intelligence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/symptom-checker">
                  <Button className="text-lg px-6 py-6 bg-health-primary hover:bg-health-primary/90 dark:bg-health-secondary dark:text-gray-900 w-full">
                    Check Your Symptoms
                  </Button>
                </Link>
                <Link to="/pill-analyzer">
                  <Button className="text-lg px-6 py-6 w-full" variant="outline">
                    Identify Your Medication
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 justify-center flex-wrap">
                <span>✓ Private & Secure</span>
                <span>✓ AI-Powered</span>
                <span>✓ Free to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Advisory Section */}
      <HealthAdvisory />
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-health-dark dark:text-white">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Simple steps to get insights about your health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-health-primary/20 dark:bg-health-secondary/20 flex items-center justify-center mb-4">
                  <span className="text-health-primary dark:text-health-secondary text-xl font-bold">1</span>
                </div>
                <CardTitle className="dark:text-white">Enter Your Symptoms</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-300">
                <p className="text-gray-600 dark:text-gray-300">
                  Select from our comprehensive list of symptoms or describe how you're feeling in your own words.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-health-secondary/20 flex items-center justify-center mb-4">
                  <span className="text-health-secondary text-xl font-bold">2</span>
                </div>
                <CardTitle className="dark:text-white">Get AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our advanced AI analyzes your symptoms and provides potential conditions with confidence scores.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-health-accent/20 flex items-center justify-center mb-4">
                  <span className="text-health-accent text-xl font-bold">3</span>
                </div>
                <CardTitle className="dark:text-white">Receive Health Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized health recommendations and understand when you should consult a healthcare professional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-health-dark dark:text-white">Features</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Comprehensive tools to manage your health
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-primary dark:text-health-secondary">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Symptom Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced AI evaluates your symptoms to provide potential health conditions with confidence scores.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-secondary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-secondary">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Pill Identification</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload an image of medication to identify the pill and learn about its usage, dosage, and warnings.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-accent/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-accent">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Health Advice</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive personalized health recommendations based on your symptoms and condition severity.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-mild/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-mild">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Severity Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get a clear understanding of the urgency of your condition with our severity classification system.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-moderate/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-moderate">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Symptom History</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your symptoms and diagnoses over time to monitor your health trends and patterns.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-health-severe/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-health-severe">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Feedback System</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Help improve our AI by providing feedback on the accuracy and helpfulness of our suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-health-primary dark:bg-health-secondary text-white dark:text-gray-900">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to check your symptoms?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get started now with our AI-powered symptom checker for quick health insights and personalized advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/symptom-checker">
              <Button size="lg" className="bg-white text-health-primary hover:bg-gray-100 hover:text-health-primary border-white dark:bg-gray-900 dark:text-white">
                Check Symptoms Now
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/login">
                <Button size="lg" className="bg-white text-health-primary hover:bg-gray-100 hover:text-health-primary border-white dark:bg-gray-900 dark:text-white">
                  Create an Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/lovable-uploads/0c1f69d9-8fbe-47ee-8b5c-83db03030f36.png" 
                  alt="SymptomSense Logo" 
                  className="h-8" 
                />
                <span className="font-bold text-lg text-health-primary dark:text-health-secondary">SymptomSense</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI-powered health symptom checker providing quick insights and personalized health advice.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/symptom-checker" className="text-gray-600 hover:text-health-primary text-sm dark:text-gray-300 dark:hover:text-health-secondary">Symptom Checker</Link></li>
                <li><Link to="/pill-analyzer" className="text-gray-600 hover:text-health-primary text-sm dark:text-gray-300 dark:hover:text-health-secondary">Pill Analyzer</Link></li>
                <li><Link to="/history" className="text-gray-600 hover:text-health-primary text-sm dark:text-gray-300 dark:hover:text-health-secondary">My History</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 dark:text-white">Important Notice</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                The information provided by this tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} SymptomSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
