
import { MainNavigation } from "@/components/layout/MainNavigation";
import { MedicalReportsList } from "@/components/medical-reports/MedicalReportsList";

const MedicalReports = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <div className="container max-w-7xl mx-auto p-4 md:p-8 flex-1">
        <MedicalReportsList />
      </div>
    </div>
  );
};

export default MedicalReports;
