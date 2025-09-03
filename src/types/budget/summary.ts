export interface BudgetSummary {
  user_id: string;
  month: string;
  type: 'income' | 'expense';
  category_type: 'income_fixed' | 'income_variable' | 'expense_fixed' | 'expense_variable';
  category_name: string;
  total_amount: number;
  transaction_count: number;
}

export interface DailyBudgetSummary {
  user_id: string;
  date: string;
  income_total: number;
  income_count: number;
  income_fixed: number;
  income_variable: number;
  expense_total: number;
  expense_count: number;
  expense_fixed: number;
  expense_variable: number;
  net_amount: number;
}

export interface BudgetStatistics {
  income: {
    fixed: number;
    variable: number;
    total: number;
    count: number;
  },
  expense: {
    fixed: number;
    variable: number;
    total: number;
    count: number;
  };
  net: number;
  totalTransactions: number;
}

export interface CategoryTotal {
  name: string;
  amount: number;
  type: 'income_fixed' | 'income_variable' | 'expense_fixed' | 'expense_variable';
  count: number;
  percentage: number;
}