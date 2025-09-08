import { QuestionWithKeywords } from '@/types/questions';
import { CheckCircle, Clock, MessageCircle, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface QuestionStatisticsProps {
  questions: QuestionWithKeywords[];
}

const QuestionStatistics = ({ questions }: QuestionStatisticsProps) => {
  const statistics = useMemo(() => {
    const total = questions.length;
    const answered = questions.filter((q) => q.is_answered).length;
    const unanswered = total - answered;
    const answerRate = total > 0 ? Math.round((answered / total) * 100) : 0;

    // 카테고리별 통계
    const dailyCount = questions.filter(
      (q) => q.category?.name === 'daily'
    ).length;
    const growthCount = questions.filter(
      (q) => q.category?.name === 'growth'
    ).length;
    const customCount = questions.filter(
      (q) => q.category?.name === 'custom'
    ).length;

    // 최근 7일 활동
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentQuestions = questions.filter(
      (q) => new Date(q.date) >= oneWeekAgo
    ).length;

    // 가장 많이 사용된 키워드 (상위 3개)
    const keywordCounts = questions
      .flatMap((q) => q.keywords || [])
      .reduce(
        (acc, keyword) => {
          acc[keyword.name] = (acc[keyword.name] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    const topKeywords = Object.entries(keywordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      total,
      answered,
      unanswered,
      answerRate,
      dailyCount,
      growthCount,
      customCount,
      recentQuestions,
      topKeywords,
    };
  }, [questions]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">질문 통계</h2>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {statistics.total}
          </div>
          <div className="text-sm text-gray-600">총 질문</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {statistics.answered}
          </div>
          <div className="text-sm text-gray-600">답변 완료</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {statistics.unanswered}
          </div>
          <div className="text-sm text-gray-600">답변 대기</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {statistics.answerRate}%
          </div>
          <div className="text-sm text-gray-600">답변률</div>
        </div>
      </div>

      {/* 카테고리별 분포 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">
          카테고리별 분포
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">일상</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{
                    width:
                      statistics.total > 0
                        ? `${(statistics.dailyCount / statistics.total) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {statistics.dailyCount}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-600">성장</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-purple-500 rounded-full"
                  style={{
                    width:
                      statistics.total > 0
                        ? `${(statistics.growthCount / statistics.total) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {statistics.growthCount}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">나만의 질문</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{
                    width:
                      statistics.total > 0
                        ? `${(statistics.customCount / statistics.total) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-sm font-medium w-8">
                {statistics.customCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          최근 7일 활동
        </h3>
        <div className="text-2xl font-bold text-blue-600">
          {statistics.recentQuestions}개
        </div>
        <div className="text-sm text-gray-600">새로운 질문</div>
      </div>

      {/* 인기 키워드 */}
      {statistics.topKeywords.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">
            인기 키워드
          </h3>
          <div className="space-y-2">
            {statistics.topKeywords.map((keyword, index) => (
              <div
                key={keyword.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium">{keyword.name}</span>
                </div>
                <span className="text-sm text-gray-600">{keyword.count}회</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionStatistics;
