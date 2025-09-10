import {
  LoginFormValues,
  ProfileUpdateFormValues,
  SignupFormValues,
} from "@/lib/validations/auth";

// Zoe에서 추출된 타입들
export type LoginFormData = LoginFormValues;
export type SignupFormData = SignupFormValues;
export type ProfileUpdateData = ProfileUpdateFormValues;

export interface FormFiledError {
  message: string;
  type: string;
}

export interface AuthFormState {
  isSubmitting: boolean;
  errors: Record<string, FormFiledError>;
  isDirty: boolean;
  isValid: boolean;
}
