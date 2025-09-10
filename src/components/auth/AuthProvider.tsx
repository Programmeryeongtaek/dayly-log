"use client";

import { useAuth } from "@/hooks/auth";
import { UserProfile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
