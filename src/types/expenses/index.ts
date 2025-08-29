import { MonthlyExpenseSummary, DailyExpenseSummary, ExpenseStatistics, CategoryTotal } from './summary';
import { ExpenseItem, ChartData, ExpenseCalendarProps, NewItemState, ExpenseFormProps, ExpenseListProps } from './ui';
import { Profile, Category, Expense } from './database';

export type {
  // Database types
  Profile,
  Category,
  Expense,

  // UI types
  ExpenseItem,
  ChartData,
  ExpenseCalendarProps,
  NewItemState,
  ExpenseFormProps,
  ExpenseListProps,

  // Summary types
  MonthlyExpenseSummary,
  DailyExpenseSummary,
  ExpenseStatistics,
  CategoryTotal
};

// Utility types
export type CategoryType = 'fixed' | 'variable';
export type ExpensesStatus = 'active' | 'deleted';

// Form validation types
export interface ExpenseFormData {
  name: string;
  amount: number;
  category_id: string;
  date: string;
  description?: string;
}

export interface CategoryFormData {
  name: string;
  type: CategoryType;
  color?: string;
}