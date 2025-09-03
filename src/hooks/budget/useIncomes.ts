import { IncomeCategoryTotal, IncomeStatistics } from './../../types/incomes/summary';
import { supabase } from '@/lib/supabase';
import { Income, IncomeFormData } from '@/types/incomes';
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
    queryFn: async (): Promise<Income[]> => {
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
    mutationFn: async (newIncome: IncomeFormData & { user_id: string; category_id: string }) => {
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
    mutationFn: async ({ id, ...updates }: Partial<IncomeFormData> & { id: string }) => {
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

  // 통계 계산
  const statistics: IncomeStatistics  = useMemo(() => {
    let fixed = 0;
    let variable = 0;
    let fixedCount = 0;
    let variableCount = 0;

    incomes.forEach(income => {
      if (income.category?.type === 'income_fixed') {
        fixed += income.amount;
        fixedCount++;
      } else if (income.category?.type === 'income_variable') {
        variable += income.amount;
        variableCount++;
      }
    });

    return {
      fixed,
      variable,
      total: fixed + variable,
      count: incomes.length,
      fixedCount,
      variableCount,
    };
  }, [incomes]);

  // 카테고리별 집계
  const categoryTotals: IncomeCategoryTotal[] = useMemo(() => {
    const totalsMap = incomes.reduce((acc, income) => {
      const categoryName = income.category?.name || 'Unknown';
      const categoryType = income.category?.type || 'income_variable';
      const existing = acc[categoryName];

      acc[categoryName] = {
        name: categoryName,
        amount: (existing?.amount || 0) + income.amount,
        type: categoryType,
      };

      return acc;
    }, {} as Record<string, IncomeCategoryTotal>);

    return Object.values(totalsMap);
  }, [incomes]);

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