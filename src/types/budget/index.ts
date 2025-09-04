import { BudgetSummary, DailyBudgetSummary, BudgetStatistics, CategoryTotal } from './summary';
import { BudgetItem, NewBudgetItemState, BudgetCalendarProps, BudgetChartProps, BudgetFormProps, BudgetListProps, ChartData } from './ui';
import { Profile, Category, BudgetTransaction, CategoryType, TransactionType, CategorySubType } from './database';

export type {
  // Database types
  Profile,
  Category,
  BudgetTransaction,
  CategoryType,
  TransactionType,
  CategorySubType,

  // UI types
  BudgetItem,
  NewBudgetItemState,
  BudgetCalendarProps,
  BudgetChartProps,
  BudgetFormProps,
  BudgetListProps,
  ChartData,

  // Summary types
  BudgetSummary,
  DailyBudgetSummary,
  BudgetStatistics,
  CategoryTotal
};

// Form validation types
export interface BudgetFormData {
  name: string;
  amount: number;
  category_id: string;
  date: string;
  type: TransactionType;
  description?: string | null;
}

export interface CategoryFormData {
  name: string;
  type: CategoryType;
  color?: string;
}

// Utility types
export type BudgetStatus = 'active' | 'deleted';

// Helper functions for type checking
export const isCategoryType = (type: string): type is CategoryType => {
  return ['income_fixed', 'income_variable', 'expense_fixed', 'expense_variable'].includes(type);
};

export const isTransactionType = (type: string): type is TransactionType => {
  return ['income', 'expense'].includes(type);
};

export const getCategorySubType = (categoryType: CategoryType): CategorySubType => {
  return categoryType.includes('fixed') ? 'fixed' : 'variable';
};

export const getTransactionType = (categoryType: CategoryType): TransactionType => {
  return categoryType.startsWith('income') ? 'income' : 'expense';
};