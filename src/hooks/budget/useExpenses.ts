import { supabase } from '@/lib/supabase';
import { CategoryTotal, Expense, ExpenseFormData, ExpenseStatistics } from '@/types/expenses';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseExpensesProps {
  userId?: string;
  date?: string;
  month?: string;
}

export const useExpenses = ({ userId, date, month }: UseExpensesProps = {}) => {
  const queryClient = useQueryClient();

  // 지출 데이터 조회
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses', userId, date, month],
    queryFn: async (): Promise<Expense[]> => {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (date) {
        query = query.eq('date', date);
      } else if (month) {
        const startOfMonth = `${month}-01`;
        const endOfMonth = new Date(
          new Date(month).getFullYear(),
          new Date(month).getMonth() + 1,
          0
        ).toISOString().split('T')[0];
        query = query.gte('date', startOfMonth).lte('date', endOfMonth);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 지출 추가
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormData & { user_id: string; category_id: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 지출 삭제
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 지출 수정
  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExpenseFormData> & { id: string}) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 통계 계산
  const statistics: ExpenseStatistics = useMemo(() => {
    let fixed = 0;
    let variable = 0;
    let fixedCount = 0;
    let variableCount = 0;

    expenses.forEach(expense => {
      if (expense.category?.type === 'fixed') {
        fixed += expense.amount;
        fixedCount++;
      } else {
        variable += expense.amount;
        variableCount++;
      }
    });

    return {
      fixed,
      variable,
      total: fixed + variable,
      count: expenses.length,
      fixedCount,
      variableCount,
    };
  }, [expenses]);

  // 카테고리별 집계
  const categoryTotals: CategoryTotal[] = useMemo(() => {
    const totalsMap = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Unknown';
      const existing = acc[categoryName];

      acc[categoryName] = {
        name: categoryName,
        amount: (existing?.amount || 0) + expense.amount,
        type: expense.category?.type || 'variable',
      };

      return acc;
    }, {} as Record<string, CategoryTotal>);

    return Object.values(totalsMap);
  }, [expenses]);

  return {
    expenses,
    statistics,
    categoryTotals,
    isLoading,
    error,
    addExpense: addExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    isAddingExpense: addExpenseMutation.isPending,
    isDeletingExpense: deleteExpenseMutation.isPending,
    isUpdatingExpense: updateExpenseMutation.isPending,
  };
};