
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationLinks } from "./NavigationLinks";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface DesktopNavigationProps {
  avatarUrl: string | null;
  userName: string | null;
}

export function DesktopNavigation({ avatarUrl, userName }: DesktopNavigationProps) {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <NavigationLinks />
      
      <div className="flex items-center ml-4">
        <ThemeToggle />
        
        {user ? (
          <UserProfileDropdown 
            avatarUrl={avatarUrl} 
            userName={userName} 
          />
        ) : (
          <Link to="/login">
            <Button variant="default" className="ml-3">
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
