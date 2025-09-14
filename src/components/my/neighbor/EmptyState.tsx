const EmptyState = ({
  type,
  icon,
  title,
  description,
}: {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default EmptyState;
