
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Pill, ClipboardList, User, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavLink {
  path: string;
  name: string;
  icon: JSX.Element;
  public: boolean;
}

export function NavigationLinks() {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Navigation links configuration
  const navLinks: NavLink[] = [
    { path: "/", name: "Home", icon: <Heart className="mr-2 h-5 w-5" />, public: true },
    { 
      path: "/symptom-checker", 
      name: "Symptom Checker", 
      icon: <ClipboardList className="mr-2 h-5 w-5" />,
      public: false
    },
    { 
      path: "/pill-analyzer", 
      name: "Pill Analyzer", 
      icon: <Pill className="mr-2 h-5 w-5" />, 
      public: false 
    },
    { 
      path: "/history", 
      name: "History", 
      icon: <User className="mr-2 h-5 w-5" />, 
      public: false 
    },
    { 
      path: "/medical-reports", 
      name: "Medical Reports", 
      icon: <FileText className="mr-2 h-5 w-5" />, 
      public: false 
    },
  ];

  // Filter links based on authentication status
  const filteredNavLinks = navLinks.filter(link => 
    link.public || (user && !link.public)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {filteredNavLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center ${isMobile ? 'px-3 py-2 text-base' : 'px-3 py-2 text-sm'} rounded-md font-medium ${
            isActive(link.path)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </>
  );
}
