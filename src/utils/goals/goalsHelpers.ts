export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '진행 중';
    case 'completed':
      return '완료됨';
    case 'paused':
      return '일시정지';
    case 'cancelled':
      return '취소됨';
    default:
      return status;
  }
};

export const getTypeText = (type: string): string => {
  switch (type) {
    case 'save_money':
      return '돈 저축';
    case 'reduce_expense':
      return '지출 줄이기';
    case 'increase_income':
      return '수입 늘리기';
    case 'custom':
      return '사용자 정의';
    default:
      return type;
  }
};

export const getChallengeMode = (mode: string): string => {
  switch (mode) {
    case 'amount':
      return '금액';
    case 'count':
      return '횟수';
    case 'both':
      return '금액 + 횟수';
    default:
      return mode;
  }
};

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
};

export const getDaysLeft = (targetDate: string | null | undefined): number | null => {
  if (!targetDate) return null;
  const daysLeft = Math.ceil(
    (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysLeft;
};

export const getGoalProgress = (goal: {
  target_amount?: number | null;
  current_amount?: number;
  target_count?: number | null;
  current_count?: number;
}) => {
  const amountProgress = goal.target_amount && goal.current_amount !== undefined 
    ? calculateProgress(goal.current_amount, goal.target_amount) 
    : 0;
  
  const countProgress = goal.target_count && goal.current_count !== undefined 
    ? calculateProgress(goal.current_count, goal.target_count) 
    : 0;
  
  // 종합 진행률 (둘 다 있으면 평균, 하나만 있으면 그것을 사용)
  let overallProgress = 0;
  if (goal.target_amount && goal.target_count) {
    overallProgress = (amountProgress + countProgress) / 2;
  } else if (goal.target_amount) {
    overallProgress = amountProgress;
  } else if (goal.target_count) {
    overallProgress = countProgress;
  }
  
  return {
    amountProgress,
    countProgress,
    overallProgress: Math.round(overallProgress),
  };
};

export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getProgressBarColor = (type: string): string => {
  return type === 'increase_income' ? '#22c55e' : '#ef4444';
};