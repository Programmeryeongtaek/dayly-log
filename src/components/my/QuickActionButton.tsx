const QuickActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors hover:cursor-pointer bg-accent-200 hover:text-white hover:bg-accent-400"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default QuickActionButton;
