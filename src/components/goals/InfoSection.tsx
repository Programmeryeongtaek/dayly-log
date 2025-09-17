import { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const InfoSection = ({ title, children, icon }: InfoSectionProps) => {
  return (
    <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <div className="p-2 bg-accent-100 rounded-lg text-accent-600">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

// 정보 항목 컴포넌트
interface InfoItemProps {
  label: string;
  value: string | number | ReactNode;
  important?: boolean;
}

export const InfoItem = ({
  label,
  value,
  important = false,
}: InfoItemProps) => {
  return (
    <div className={"flex justify-between items-center"}>
      <span className="text-gray-600 font-medium">{label}</span>
      <span
        className={`${
          important
            ? "text-lg font-bold text-accent-600"
            : "text-gray-900 font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default InfoSection;
