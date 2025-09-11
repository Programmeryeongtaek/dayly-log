const StatsCard = ({
  icon,
  label,
  value,
  subtext,
  color = 'blue',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtext?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
