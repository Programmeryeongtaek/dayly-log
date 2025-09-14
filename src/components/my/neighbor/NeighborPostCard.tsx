import { NeighborPostCardProps } from "@/types/my";
import { Calendar, CheckCircle, HelpCircle, Tag } from "lucide-react";

const NeighborPostCard = ({ post }: NeighborPostCardProps) => {
  const isQuestion =
    post.category_name === "daily" ||
    post.category_name === "growth" ||
    post.category_name === "custom";

  const getDomainColor = (category: string) => {
    const colors = {
      gratitude: "text-orange-600 bg-orange-50 border-orange-200",
      reflection: "text-blue-600 bg-blue-50 border-blue-200",
      daily: "text-green-600 bg-green-50 border-green-200",
      growth: "text-purple-600 bg-purple-50 border-purple-200",
      custom: "text-indigo-600 bg-indigo-50 border-indigo-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "text-gray-600 bg-gray-50 border-gray-200"
    );
  };

  const getDomainIcon = (category: string) => {
    if (category === "gratitude" || category === "reflection") {
      return null; // 회고는 아이콘 없음
    }
    return post.is_answered ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <HelpCircle className="w-4 h-4 text-gray-400" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border-2 border-accent-100 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-accent-400 hover:bg-accent-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDomainColor(post.category_name)}`}
          >
            {getDomainIcon(post.category_name)}
            <span className="ml-1">{post.category_display_name}</span>
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(post.date)}
        </div>
      </div>

      {/* 제목 (질문의 경우) */}
      {post.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h3>
      )}

      {/* 내용 */}
      <div className="text-gray-700 mb-4">
        <p className="line-clamp-3 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* 답변 (질문이고 답변이 있는 경우) */}
      {isQuestion && post.answer && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-800">답변</span>
          </div>
          <p className="text-green-700 line-clamp-2 whitespace-pre-wrap">
            {post.answer}
          </p>
        </div>
      )}

      {/* 키워드 */}
      {post.keywords && post.keywords.length > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span
                key={keyword.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                style={{ backgroundColor: keyword.color }}
              >
                {keyword.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 상태 표시 (질문인 경우) */}
      {isQuestion && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.is_answered ? (
              <span className="inline-flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                답변 완료
              </span>
            ) : (
              <span className="inline-flex items-center text-sm text-gray-500">
                <HelpCircle className="w-4 h-4 mr-1" />
                답변 대기
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeighborPostCard;
