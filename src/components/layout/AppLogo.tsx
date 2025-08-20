
import React from "react";
import { Link } from "react-router-dom";

export function AppLogo() {
  return (
    <Link to="/" className="flex items-center">
      <div className="flex flex-col">
        <span className="font-bold text-lg">SymptomSense</span>
        <span className="text-xs text-muted-foreground">AI Health Assistant</span>
      </div>
    </Link>
  );
}
