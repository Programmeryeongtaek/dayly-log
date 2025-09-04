export interface Profile {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetTransaction {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income_fixed' | 'income_variable' | 'expense_fixed' | 'expense_variable';
  color: string;
  is_default: boolean;
  is_deleted?: boolean;
  transactionCount?: number;
  created_at: string;
  updated_at: string;
}

export type CategoryType = 'income_fixed' | 'income_variable' | 'expense_fixed' | 'expense_variable';
export type TransactionType = 'income' | 'expense';
export type CategorySubType = 'fixed' | 'variable';