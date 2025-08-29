export interface Profile {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'fixed' | 'variable';
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  // 조인된 카테고리 정보
  category?: Category;
}