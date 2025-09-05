'use client';

import { createContext, ReactNode, useContext } from 'react';
import GoalUpdateNotification from '../goals/GoalUpdateNotification';
import { useTransactionAlert } from '@/hooks/budget/useTransactionAlert';

interface TransactionAlertContextType {
  showAlert: (categoryName: string, type: 'income' | 'expense') => void;
  hideAlert: (categoryName: string) => void;
  clearAllAlerts: () => void;
}

const TransactionAlertContext =
  createContext<TransactionAlertContextType | null>(null);

export const useTransactionAlertContext = () => {
  const context = useContext(TransactionAlertContext);
  if (!context) {
    throw new Error(
      'useTransactionAlertContext must be used within a TransactionAlertProvider'
    );
  }
  return context;
};

interface TransactionAlertProviderProps {
  children: ReactNode;
}

const TransactionAlertProvider = ({
  children,
}: TransactionAlertProviderProps) => {
  const { alerts, showAlert, hideAlert, clearAllAlerts } =
    useTransactionAlert();

  return (
    <TransactionAlertContext.Provider
      value={{ showAlert, hideAlert, clearAllAlerts }}
    >
      {children}

      {/* 알림들 렌더링 */}
      {alerts.map((alert) => (
        <GoalUpdateNotification
          key={`${alert.categoryName}-${alert.type}`}
          categoryName={alert.categoryName}
          onClose={() => hideAlert(alert.categoryName)}
        />
      ))}
    </TransactionAlertContext.Provider>
  );
};

export default TransactionAlertProvider;
