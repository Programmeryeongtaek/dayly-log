import { supabase } from '@/lib/supabase';
import { 
  CategoryTotal, 
  BudgetTransaction, 
  BudgetFormData, 
  BudgetStatistics 
} from '@/types/budget';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseIncomesProps {
  userId?: string;
  date?: string;
  month?: string;
}

export const useIncomes = ({ userId, date, month }: UseIncomesProps = {}) => {
  const queryClient = useQueryClient();
  
  // 수입 데이터 조회
  const { data: incomes = [], isLoading, error } = useQuery({
    queryKey: ['incomes', userId, date, month],
    queryFn: async (): Promise<BudgetTransaction[]> => {
      let query = supabase
        .from('incomes')
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

  // 수입 추가
  const addIncomeMutation = useMutation({
    mutationFn: async (newIncome: BudgetFormData & { user_id: string; category_id: string }) => {
      const { data, error } = await supabase
        .from('incomes')
        .insert([newIncome])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  // 수입 삭제
  const deleteIncomeMutation = useMutation({
    mutationFn: async (incomeId: string) => {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', incomeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  // 수입 수정
  const updateIncomeMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BudgetFormData> & { id: string }) => {
      const { data, error } = await supabase
        .from('incomes')
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
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });

  // 통계 계산 - 메모리 효율적 구현
  const statistics: BudgetStatistics = useMemo(() => {
    const stats = {
      income: { fixed: 0, variable: 0, total: 0, count: 0 },
      expense: { fixed: 0, variable: 0, total: 0, count: 0 },
      net: 0,
      totalTransactions: incomes.length,
    };

    incomes.forEach(income => {
      const amount = income.amount;
      const categoryType = income.category?.type;

      if (income.type === 'income') {
        stats.income.count++;
        if (categoryType === 'income_fixed') {
          stats.income.fixed += amount;
        } else {
          stats.income.variable += amount;
        }
      }
    });

    stats.income.total = stats.income.fixed + stats.income.variable;
    stats.net = stats.income.total - stats.expense.total;

    return stats;
  }, [incomes]);

  // 카테고리별 집계 - 메모리 효율적 구현
  const categoryTotals: CategoryTotal[] = useMemo(() => {
    const totalsMap: Record<string, CategoryTotal> = {};

    incomes.forEach(income => {
      const categoryName = income.category?.name || 'Unknown';
      const categoryType = income.category?.type || 'income_variable';
      const amount = income.amount;

      if (!totalsMap[categoryName]) {
        totalsMap[categoryName] = {
          name: categoryName,
          amount: 0,
          type: categoryType,
          count: 0,
          percentage: 0,
        };
      }

      totalsMap[categoryName].amount += amount;
      totalsMap[categoryName].count++;
    });

    const totalAmount = statistics.income.total;
    
    return Object.values(totalsMap).map(category => ({
      ...category,
      percentage: totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0,
    }));
  }, [incomes, statistics]);

  return {
    incomes,
    statistics,
    categoryTotals,
    isLoading,
    error,
    addIncome: addIncomeMutation.mutate,
    deleteIncome: deleteIncomeMutation.mutate,
    updateIncome: updateIncomeMutation.mutate,
    isAddingIncome: addIncomeMutation.isPending,
    isDeletingIncome: deleteIncomeMutation.isPending,
    isUpdatingIncome: updateIncomeMutation.isPending,
  };
};