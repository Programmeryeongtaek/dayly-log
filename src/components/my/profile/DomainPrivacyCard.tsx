import { Globe, Lock, Users } from "lucide-react";

const DomainPrivacyCard = ({
  icon,
  title,
  visibility,
  onVisibilityChange,
}: {
  icon: React.ReactNode;
  title: string;
  visibility: "public" | "neighbors" | "private";
  onVisibilityChange: (visibility: "public" | "neighbors" | "private") => void;
}) => {
  const getVisibilityInfo = (level: "public" | "neighbors" | "private") => {
    switch (level) {
      case "public":
        return {
          icon: <Globe className="w-4 h-4" />,
          label: "전체",
          color: "text-green-600 bg-green-50",
        };
      case "neighbors":
        return {
          icon: <Users className="w-4 h-4" />,
          label: "이웃",
          color: "text-blue-600 bg-blue-50",
        };
      case "private":
        return {
          icon: <Lock className="w-4 h-4" />,
          label: "비공개",
          color: "text-gray-600 bg-gray-50",
        };
    }
  };

  return (
    <div className="flex flex-col gap-3 px-4 flex-1">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>

      <div className="space-y-2">
        {(["public", "neighbors", "private"] as const).map((level) => {
          const info = getVisibilityInfo(level);
          return (
            <button
              key={level}
              onClick={() => onVisibilityChange(level)}
              className={`w-full p-3 rounded-lg border-2 transition-all hover:cursor-pointer ${
                visibility === level
                  ? "border-accent-500 bg-accent-50"
                  : "border-gray-200 hover:border-accent-300"
              }`}
            >
              <div className="flex items-center gao-2">
                <div className={`p-1 rounded ${info.color}`}>{info.icon}</div>
                <span className="font-medium text-gray-900">{info.label}</span>
                {visibility === level && (
                  <div className="ml-auto w-2 h-2 bg-accent-500 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DomainPrivacyCard;
