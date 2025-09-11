import { Eye, Lock, Users } from 'lucide-react';

const VisibilityIcon = ({
  isPublic,
  isNeighborVisible,
}: {
  isPublic: boolean;
  isNeighborVisible: boolean;
}) => {
  if (isPublic) {
    return <Eye className="w-4 h-4 text-green-600" />;
  } else if (isNeighborVisible) {
    return <Users className="w-4 h-4 text-blue-600" />;
  } else {
    return <Lock className="w-4 h-4 text-gray-600" />;
  }
};

export default VisibilityIcon;
