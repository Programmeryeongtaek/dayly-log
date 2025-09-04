import { BudgetTransaction, Category } from './database';

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  categoryType: 'fixed' | 'variable';
}

export interface NewBudgetItemState {
  name: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
  categoryType: 'fixed' | 'variable';
  newCategoryName: string;
  isCreatingCategory: boolean;
}

export interface BudgetCalendarProps {
  currentDate: Date;
  calendarDays: (Date | null)[];
  dailyTotals: Record<string, { income: number; expense: number; net: number }>;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
  formatDateString: (date: Date) => string;
}

export interface BudgetChartProps {
  incomeData: ChartData[];
  expenseData: ChartData[];
  isFixedEnabled: boolean;
  onFixedToggle: (enabled: boolean) => void;
  totals: {
    income: { fixed: number; variable: number; total: number };
    expense: { fixed: number; variable: number; total: number };
    net: number;
  };
  categories: {
    incomeFixed: Array<{ id: string; name: string; type: string }>;
    incomeVariable: Array<{ id: string; name: string; type: string }>;
    expenseFixed: Array<{ id: string; name: string; type: string }>;
    expenseVariable: Array<{ id: string; name: string; type: string }>;
  };
  transactions?: BudgetTransaction[];
  onChallengeClick?: (categoryName: string, amount: number, count: number, type: 'income' | 'expense') => void;
}

export interface BudgetFormProps {
  selectedDate: string;
  newItem: NewBudgetItemState;
  onNewItemChange: (updates: Partial<NewBudgetItemState>) => void;
  onBackToMonth: () => void;
  onAddItem: () => void;
  onAddCategory: () => void;
  getCurrentCategories: () => Category[];
}

export interface BudgetListProps {
  items: BudgetItem[];
  onDeleteItem: (id: string) => void;
  title: string;
  type: 'income' | 'expense' | 'all';
}

export interface ChartData {
  name: string;
  value: number;
}