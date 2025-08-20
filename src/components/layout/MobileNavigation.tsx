
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { NavigationLinks } from "./NavigationLinks";

interface MobileNavigationProps {
  avatarUrl: string | null;
  userName: string | null;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function MobileNavigation({ 
  avatarUrl, 
  userName, 
  isMobileMenuOpen, 
  toggleMobileMenu 
}: MobileNavigationProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <div className="flex md:hidden items-center space-x-4">
        <ThemeToggle />
        
        {user && (
          <Link to="/profile">
            <Avatar className="h-8 w-8">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
        )}
        
        <Button variant="ghost" onClick={toggleMobileMenu} size="sm">
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t mt-3">
          <div className="space-y-1">
            <NavigationLinks />
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Profile Settings
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut} 
                  className="flex items-center w-full px-3 py-2 text-left text-destructive hover:bg-accent"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" className="block">
                <Button variant="default" className="w-full mt-2">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
