export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ExpenseCalendarProps {
  currentDate: Date;
  calendarDays: (Date | null)[];
  dailyTotals: Record<string, number>;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
  formatDateString: (date: Date) => string;
}

export interface ExpenseChartProps {
  chartData: ChartData[];
  isFixedEnabled: boolean;
  onFixedToggle: (enabled: boolean) => void;
  totals: {
    fixed: number;
    variable: number;
    total: number;
  };
  fixedCategories: Array<{ id: string; name: string; type: string }>;
  variableCategories: Array<{ id: string; name: string; type: string }>;
  fixedExpenses: Array<{ category: string; amount: number }>;
  variableExpenses: Array<{ category: string; amount: number }>;
}

export interface NewItemState {
  name: string;
  amount: string;
  category: string;
  type: 'fixed' | 'variable';
  newCategoryName: string;
  isCreatingCategory: boolean;
}

export interface ExpenseFormProps {
  selectedDate: string;
  newItem: NewItemState;
  onNewItemChange: (updates: Partial<NewItemState>) => void;
  onBackToMonth: () => void;
  onAddExpense: () => void;
  onAddCategory: () => void;
  getCurrentCategories: () => Array<{ id: string; name: string; type: 'fixed' | 'variable' }>;
}

export interface ExpenseListProps {
  expenses: ExpenseItem[];
  fixedCategories: Array<{ id: string; name: string; type: string }>;
  onDeleteExpense: (id: string) => void;
  title: string;
}