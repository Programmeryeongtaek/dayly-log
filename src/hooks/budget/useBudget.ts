import { useTransactionAlertContext } from "@/components/budget/TransactionAlertProvider";
import { supabase } from "@/lib/supabase";
import {
  BudgetFormData,
  BudgetStatistics,
  BudgetTransaction,
  CategoryTotal,
  TransactionType,
} from "@/types/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { useMemo } from "react";
import { useGoalStatusUpdater } from "../goals/useGoalStatusUpdater";

interface UseBudgetProps {
  userId?: string;
  date?: string;
  month?: string;
}

export const useBudget = ({ userId, date, month }: UseBudgetProps = {}) => {
  const queryClient = useQueryClient();
  const { showAlert } = useTransactionAlertContext();
  const { checkGoalsByCategory } = useGoalStatusUpdater();

  // 통합 데이터 조회 (수입 + 지출)
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["budget", userId, date, month],
    queryFn: async (): Promise<BudgetTransaction[]> => {
      if (!userId) return [];

      // 수입 데이터 조회
      let incomeQuery = supabase
        .from("incomes")
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .eq("user_id", userId)
        .order("date", { ascending: false });

      // 지출 데이터 조회
      let expenseQuery = supabase
        .from("expenses")
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .eq("user_id", userId)
        .order("date", { ascending: false });

      // 날짜 필터링
      if (date) {
        incomeQuery = incomeQuery.eq("date", date);
        expenseQuery = expenseQuery.eq("date", date);
      } else if (month) {
        const startDate = startOfMonth(parseISO(`${month}-01`));
        const endDate = endOfMonth(parseISO(`${month}-01`));

        const startOfMonthStr = format(startDate, "yyyy-MM-dd");
        const endOfMonthStr = format(endDate, "yyyy-MM-dd");

        incomeQuery = incomeQuery
          .gte("date", startOfMonthStr)
          .lte("date", endOfMonthStr);
        expenseQuery = expenseQuery
          .gte("date", startOfMonthStr)
          .lte("date", endOfMonthStr);
      }

      const [incomeResult, expenseResult] = await Promise.all([
        incomeQuery,
        expenseQuery,
      ]);

      if (incomeResult.error) throw incomeResult.error;
      if (expenseResult.error) throw expenseResult.error;

      // 데이터 통합 및 타입 표시
      const incomeTransactions: BudgetTransaction[] = (
        incomeResult.data || []
      ).map((item) => ({
        ...item,
        type: "income" as const,
      }));

      const expenseTransactions: BudgetTransaction[] = (
        expenseResult.data || []
      ).map((item) => ({
        ...item,
        type: "expense" as const,
      }));

      return [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    },
    enabled: !!userId,
  });

  // 통계 계산 (먼저 계산되어야 함)
  const statistics: BudgetStatistics = useMemo(() => {
    let incomeFixed = 0;
    let incomeVariable = 0;
    let incomeCount = 0;

    let expenseFixed = 0;
    let expenseVariable = 0;
    let expenseCount = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeCount++;
        if (transaction.category?.type === "income_fixed") {
          incomeFixed += transaction.amount;
        } else {
          incomeVariable += transaction.amount;
        }
      } else {
        expenseCount++;
        if (transaction.category?.type === "expense_fixed") {
          expenseFixed += transaction.amount;
        } else {
          expenseVariable += transaction.amount;
        }
      }
    });

    const incomeTotal = incomeFixed + incomeVariable;
    const expenseTotal = expenseFixed + expenseVariable;

    return {
      income: {
        fixed: incomeFixed,
        variable: incomeVariable,
        total: incomeTotal,
        count: incomeCount,
      },
      expense: {
        fixed: expenseFixed,
        variable: expenseVariable,
        total: expenseTotal,
        count: expenseCount,
      },
      net: incomeTotal - expenseTotal,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  // 카테고리별 집계 (statistics 이후에 계산)
  const categoryTotals: CategoryTotal[] = useMemo(() => {
    const totalsMap = transactions.reduce(
      (acc, transaction) => {
        const categoryName = transaction.category?.name || "Unknown";
        const categoryType = transaction.category?.type || "expense_variable";
        const existing = acc[categoryName];

        acc[categoryName] = {
          name: categoryName,
          amount: (existing?.amount || 0) + transaction.amount,
          type: categoryType,
          count: (existing?.count || 0) + 1,
          percentage: 0, // 나중에 계산
        };

        return acc;
      },
      {} as Record<string, CategoryTotal>,
    );

    const totalAmount = statistics.income.total + statistics.expense.total;

    return Object.values(totalsMap).map((category) => ({
      ...category,
      percentage: totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0,
    }));
  }, [transactions, statistics]);

  // 차트 데이터 생성
  const chartData = useMemo(() => {
    // 거래 데이터에서 직접 차트 데이터 생성
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      const categoryName = transaction.category?.name || "Unknown";
      const amount = transaction.amount;

      if (transaction.type === "income") {
        incomeMap.set(
          categoryName,
          (incomeMap.get(categoryName) || 0) + amount,
        );
      } else if (transaction.type === "expense") {
        expenseMap.set(
          categoryName,
          (expenseMap.get(categoryName) || 0) + amount,
        );
      }
    });

    const incomeData = Array.from(incomeMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const expenseData = Array.from(expenseMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    return { incomeData, expenseData };
  }, [transactions]);

  // 일별 집계 계산 (캘린더용)
  const dailyTotals = useMemo(() => {
    const totals: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};

    transactions.forEach((transaction) => {
      const dateKey = transaction.date;
      if (!totals[dateKey]) {
        totals[dateKey] = { income: 0, expense: 0, net: 0 };
      }

      if (transaction.type === "income") {
        totals[dateKey].income += transaction.amount;
      } else {
        totals[dateKey].expense += transaction.amount;
      }

      totals[dateKey].net = totals[dateKey].income - totals[dateKey].expense;
    });

    return totals;
  }, [transactions]);

  // BudgetItem 형태로 변환 (컴포넌트용)
  const budgetItems = useMemo(() => {
    return transactions.map((transaction) => ({
      id: transaction.id,
      name: transaction.name,
      amount: transaction.amount,
      category: transaction.category?.name || "Unknown",
      date: transaction.date,
      type: transaction.type,
      categoryType: transaction.category?.type?.includes("fixed")
        ? ("fixed" as const)
        : ("variable" as const),
    }));
  }, [transactions]);

  // 항목 추가
  const addTransactionMutation = useMutation({
    mutationFn: async (
      newTransaction: BudgetFormData & { user_id: string; category_id: string },
    ) => {
      const tableName =
        newTransaction.type === "income" ? "incomes" : "expenses";

      const { type, ...transactionData } = newTransaction;

      const { data, error } = await supabase
        .from(tableName)
        .insert([transactionData])
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .single();

      if (error) throw error;
      return { ...data, type };
    },
    onSuccess: async (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });

      // 알림 표시
      if (newTransaction.category?.name && userId) {
        // 목표 상태 확인 (알림보다 먼저 실행)
        await checkGoalsByCategory(
          userId,
          newTransaction.category.name,
          newTransaction.type,
        );

        // 지연을 두어 TanStack Query 업데이트 후 알림 표시
        setTimeout(() => {
          showAlert(newTransaction.category!.name, newTransaction.type);
        }, 100);
      }
    },
  });

  // 항목 삭제
  const deleteTransactionMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: TransactionType }) => {
      const tableName = type === "income" ? "incomes" : "expenses";

      // 삭제 전에 거래 정보 조회 (알림용)
      const { data: transactionToDelete } = await supabase
        .from(tableName)
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .eq("id", id)
        .single();

      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) throw error;

      return { deletedTransaction: transactionToDelete, type };
    },
    onSuccess: ({ deletedTransaction, type }) => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });

      // 알림 표시
      if (deletedTransaction?.category?.name && userId) {
        setTimeout(() => {
          showAlert(deletedTransaction.category!.name, type);
        }, 100);
      }
    },
  });

  // 항목 수정
  const updateTransactionMutation = useMutation({
    mutationFn: async ({
      id,
      type,
      updates,
    }: {
      id: string;
      type: TransactionType;
      updates: Partial<BudgetFormData>;
    }) => {
      const tableName = type === "income" ? "incomes" : "expenses";

      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .single();

      if (error) throw error;
      return { ...data, type };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  return {
    transactions,
    budgetItems,
    dailyTotals,
    chartData,
    statistics,
    categoryTotals,
    isLoading,
    error,
    addTransaction: addTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    isAddingTransaction: addTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
  };
};
