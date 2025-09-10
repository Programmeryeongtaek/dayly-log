import { AuthState, AuthError } from "./ui";
import { LoginFormData, SignupFormData, ProfileUpdateData } from "./forms";
import { AuthUser, UserProfile } from "./database";

export type {
  // Database types
  AuthUser,
  UserProfile,

  // Form types
  LoginFormData,
  SignupFormData,
  ProfileUpdateData,

  // UI types
  AuthState,
  AuthError,
};

// Utility types
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
export type AuthAction = "login" | "signup" | "logout" | "update-profile";
