
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { AuthForm } from "../components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  
  const handleAuthSuccess = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-health-light px-4 py-12">
      <div className="max-w-md w-full">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default Login;
