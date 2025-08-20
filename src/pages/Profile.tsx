
import { MainNavigation } from "@/components/layout/MainNavigation";
import UserProfile from "@/components/user/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  
  // If loading, return nothing
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
