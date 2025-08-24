'use client';

import { Trash2 } from 'lucide-react';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  fixedCategories: Category[];
  onDeleteExpense: (id: string) => void;
  title: string;
}

export default function ExpenseList({
  expenses,
  fixedCategories,
  onDeleteExpense,
  title,
}: ExpenseListProps) {
  if (expenses.length === 0) return null;

  return (
    <div className="mt-4 mobile:mt-6 pt-4 mobile:pt-6 border-t">
      <h3 className="font-medium text-gray-700 mb-2 mobile:mb-3 text-sm mobile:text-base">
        {title} ({expenses.length}건)
      </h3>
      <div className="space-y-2">
        {expenses
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-2 mobile:p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2 mobile:gap-3 flex-1 min-w-0">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    fixedCategories.some((cat) => cat.name === expense.category)
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {expense.category}
                </span>
                <span className="font-medium text-sm mobile:text-base truncate">
                  {expense.name}
                </span>
                <span className="text-accent-600 font-semibold text-sm mobile:text-base flex-shrink-0">
                  {expense.amount.toLocaleString()}원
                </span>
              </div>
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
              >
                <Trash2 className="w-3 h-3 mobile:w-4 mobile:h-4" />
              </button>
            </div>
          ))}
      </div>
      <div className="mt-2 mobile:mt-3 p-2 mobile:p-3 bg-accent-50 rounded-lg">
        <div className="flex justify-between font-semibold text-accent-700 text-sm mobile:text-base">
          <span>총 지출:</span>
          <span>
            {expenses
              .reduce((sum, item) => sum + item.amount, 0)
              .toLocaleString()}
            원
          </span>
        </div>
      </div>
    </div>
  );
}
