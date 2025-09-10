import BudgetPageContent from '@/components/budget/BudgetPageContent';
import { Suspense } from 'react';

const BudgetPage = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-2 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <BudgetPageContent />
    </Suspense>
  );
};

export default BudgetPage;
