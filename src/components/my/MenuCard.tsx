import { ChevronRight } from 'lucide-react';

const MenuCard = ({
  icon,
  title,
  count,
  badge,
  unit = '개',
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  badge?: number;
  unit?: string;
  onClick: () => void;
}) => (
  <div
    className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer hover:bg-accent-100 hover:border-accent-400"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex items-center space-x-2">
        {badge && badge > 0 && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
    {count !== undefined && (
      <div className="text-2xl font-bold text-gray-900">
        {count}
        {unit}
      </div>
    )}
  </div>
);

export default MenuCard;
