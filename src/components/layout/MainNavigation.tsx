
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLogo } from "./AppLogo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userName } = useAuth();
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Avatar fetching disabled until backend storage is added
  useEffect(() => {
    setAvatarUrl(null);
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AppLogo />
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNavigation 
            avatarUrl={avatarUrl} 
            userName={userName} 
          />
          
          {/* Mobile Navigation */}
          <MobileNavigation 
            avatarUrl={avatarUrl}
            userName={userName}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </div>
    </header>
  );
}
 