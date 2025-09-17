const StatCard = ({
  icon,
  title,
  value,
  color = 'accent',
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color?: 'accent' | 'green' | 'yellow' | 'purple' | 'red';
  subtitle?: string;
}) => {
  const colorClasses = {
    accent: 'from-accent-500 to-accent-400 text-white',
    green: 'from-green-500 to-emerald-400 text-white',
    yellow: 'from-yellow-500 to-orange-400 text-white',
    purple: 'from-purple-500 to-pink-400 text-white',
    red: 'from-red-500 to-pink-400 text-white',
  };

  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10 group-hover:opacity-20 transition-opacity`}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
          >
            {icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
