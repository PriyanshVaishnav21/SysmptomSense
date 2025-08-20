
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthAdvisory() {
  const advisories = [
    {
      id: 1,
      title: "COVID-19 Prevention",
      description: "Wash hands regularly, wear masks in crowded areas, and stay up to date with vaccinations."
    },
    {
      id: 2,
      title: "Mental Health Awareness",
      description: "Check in with family and friends. Seek professional help if experiencing persistent symptoms of depression or anxiety."
    },
    {
      id: 3,
      title: "Seasonal Flu Prevention",
      description: "Annual flu vaccines are recommended for everyone 6 months and older, especially important for high-risk groups."
    },
    {
      id: 4,
      title: "Healthy Lifestyle",
      description: "Aim for at least 150 minutes of moderate physical activity weekly and maintain a balanced diet rich in fruits and vegetables."
    },
    {
      id: 5,
      title: "Medication Safety",
      description: "Never share prescription medications and always follow recommended dosages. Store medications out of reach of children."
    }
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-health-primary dark:text-health-secondary">Government Health Advisories</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Important health information and guidelines from official health authorities
          </p>
        </div>

        <Alert className="mb-6 border-health-primary/30 bg-health-primary/5 dark:bg-health-primary/10 dark:border-health-primary/20">
          <AlertTitle className="font-semibold text-health-primary dark:text-health-secondary">Official Health Guidelines</AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            The following advisories are based on recommendations from government health agencies. Always consult with healthcare professionals for personalized advice.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisories.map((advisory) => (
            <Card key={advisory.id} className="border-health-primary/20 dark:border-health-primary/10 dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-health-primary dark:text-health-secondary">{advisory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">{advisory.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
