import { useCallback, useState } from 'react';

interface TransactionAlert {
  categoryName: string;
  type: 'income' | 'expense';
  isVisible: boolean;
}

export const useTransactionAlert = () => {
  const [alerts, setAlerts] = useState<TransactionAlert[]>([]);

  const showAlert = useCallback((categoryName: string, type: 'income' | 'expense') => {
    // 중복 알림 방지
    setAlerts(prev => {
      const exists = prev.some(alert =>
        alert.categoryName === categoryName && alert.type === type
      );

      if (exists) return prev;

      return [...prev, { categoryName, type, isVisible: true }];
    });
  }, []);

  const hideAlert = useCallback((categoryName: string) => {
    setAlerts(prev => prev.filter(alert => alert.categoryName !== categoryName));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    hideAlert,
    clearAllAlerts,
  };
};