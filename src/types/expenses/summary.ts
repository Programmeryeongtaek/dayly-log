export interface MonthlyExpenseSummary {
  user_id: string;
  month: string;
  category_type: 'fixed' | 'variable';
  category_name: string;
  total_amount: number;
  expense_count: number;
}

export interface DailyExpenseSummary {
  user_id: string;
  date: string;
  total_amount: number;
  expense_count: number;
  fixed_amount: number;
  variable_amount: number;
}

export interface ExpenseStatistics {
  fixed: number;
  variable: number;
  total: number;
  count: number;
  fixedCount: number;
  variableCount: number;
}

export interface CategoryTotal {
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}