interface ProgressBarProps {
  current: number;
  target: number;
  type: string;
  title: string;
  unit?: string;
}

const ProgressBar = ({
  current,
  target,
  type,
  title,
  unit = '',
}: ProgressBarProps) => {
  let progress: number;
  let statusMessage: string;
  let barColor: string;
  let targetLabel: string;

  if (type === 'reduce_expense') {
    // 지출 챌린지: 한도 대비 사용량
    progress = Math.round((current / target) * 100);
    const remaining = Math.max(0, target - current);
    statusMessage =
      remaining > 0
        ? `${remaining.toLocaleString()}${unit} 더 사용 가능`
        : `${(current - target).toLocaleString()}${unit} 초과`;
    targetLabel = '한도';

    // 사용량에 따른 색상
    if (progress > 100) {
      barColor = '#ef4444'; // 빨간색 (초과)
    } else if (progress > 80) {
      barColor = '#f59e0b'; // 노란색 (주의)
    } else {
      barColor = '#22c55e'; // 초록색 (양호)
    }
  } else {
    // 수입 챌린지: 기존 로직
    progress = Math.round((current / target) * 100);
    const remaining = Math.max(0, target - current);
    statusMessage =
      remaining > 0
        ? `목표까지 ${remaining.toLocaleString()}${unit} 남음`
        : `목표 달성!`;
    targetLabel = '목표';
    barColor = progress >= 100 ? '#22c55e' : '#3b82f6';
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {type === 'reduce_expense' ? '지출 한도 사용률' : title}
        </h3>
        <span
          className={`text-2xl font-bold ${
            type === 'reduce_expense' && progress > 100
              ? 'text-red-600'
              : 'text-accent-600'
          }`}
        >
          {progress}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            현재 사용: {current.toLocaleString()}
            {unit}
          </span>
          <span>
            {targetLabel}: {target.toLocaleString()}
            {unit}
          </span>
        </div>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: barColor,
            }}
          />
          {progress >= 100 && (
            <div className="absolute right-2 top-0.5 text-white text-xs">
              {type === 'reduce_expense' ? '!' : '✓'}
            </div>
          )}
        </div>

        <p
          className={`text-xs text-center ${
            type === 'reduce_expense' && progress > 100
              ? 'text-red-600 font-medium'
              : 'text-gray-500'
          }`}
        >
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
