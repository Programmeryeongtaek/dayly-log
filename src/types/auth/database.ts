export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string | null;
  created_at: string;
  updated_at: string;
}