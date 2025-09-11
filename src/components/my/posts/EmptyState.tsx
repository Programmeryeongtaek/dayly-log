import { FileText } from 'lucide-react';

const EmptyState = ({
  title,
  description,
}: {
  type: 'posts' | 'search';
  title: string;
  description: string;
}) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">
      <FileText className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default EmptyState;
