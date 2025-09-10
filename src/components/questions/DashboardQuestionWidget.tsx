"use client";

import { useAuth } from "@/hooks/auth";
import { useQuestions } from "@/hooks/questions/useQuestions";
import { QuestionKeyword } from "@/types/questions";
import {
  MessageSquare,
  Hash,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const DashboardQuestionWidget = () => {
  const { user } = useAuth();

  const { questions, statistics, isLoading } = useQuestions({
    userId: user?.id,
    filters: {}, // 전체 기간
  });

  // 최근 1주일 키워드 분석
  const recentKeywordAnalysis = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentQuestions = questions.filter(
      (q) => new Date(q.date) >= oneWeekAgo,
    );

    const keywordMap = new Map<
      string,
      {
        keyword: QuestionKeyword;
        count: number;
      }
    >();

    recentQuestions.forEach((question) => {
      question.keywords?.forEach((keyword) => {
        if (!keywordMap.has(keyword.name)) {
          keywordMap.set(keyword.name, {
            keyword,
            count: 0,
          });
        }
        keywordMap.get(keyword.name)!.count++;
      });
    });

    return Array.from(keywordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [questions]);

  // 카테고리별 최근 통계
  const categoryStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentQuestions = questions.filter(
      (q) => new Date(q.date) >= oneWeekAgo,
    );

    const daily = recentQuestions.filter((q) => q.category?.name === "daily");
    const growth = recentQuestions.filter((q) => q.category?.name === "growth");
    const custom = recentQuestions.filter((q) => q.category?.name === "custom");

    return [
      { name: "일상", count: daily.length, color: "text-green-600" },
      { name: "성장", count: growth.length, color: "text-purple-600" },
      { name: "나만의", count: custom.length, color: "text-blue-600" },
    ];
  }, [questions]);

  // 미답변 질문 수
  const unansweredCount = useMemo(() => {
    return questions.filter((q) => !q.is_answered).length;
  }, [questions]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          성찰 질문
        </h2>
        <Link
          href="/questions"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          모두 보기 <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 주요 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {statistics.total}
          </div>
          <div className="text-xs text-gray-600">총 질문</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {statistics.answerRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">답변률</div>
        </div>
      </div>

      {/* 답변 현황 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">답변 현황</span>
          <span className="text-xs text-gray-500">
            {statistics.answered} / {statistics.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${statistics.total > 0 ? (statistics.answered / statistics.total) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-3 h-3" />
            답변 {statistics.answered}개
          </div>
          {unansweredCount > 0 && (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="w-3 h-3" />
              대기 {unansweredCount}개
            </div>
          )}
        </div>
      </div>

      {/* 최근 1주일 카테고리 활동 */}
      {categoryStats.some((cat) => cat.count > 0) && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            최근 1주일 활동
          </h3>
          <div className="space-y-2">
            {categoryStats.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <span className={`text-sm ${category.color}`}>
                  {category.name}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {category.count}개
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인기 키워드 (최근 1주일) */}
      {recentKeywordAnalysis.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            주간 인기 키워드
          </h3>
          <div className="space-y-2">
            {recentKeywordAnalysis.map((item, index) => (
              <div
                key={item.keyword.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400 w-4">
                    {index + 1}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${item.keyword.color}20`,
                      color: item.keyword.color,
                    }}
                  >
                    #{item.keyword.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {statistics.total === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            첫 질문을 만들어보세요
          </h3>
          <p className="text-gray-500 mb-4">
            스스로에게 던지는 질문은 성장의 시작입니다
          </p>
          <Link
            href="/questions/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />첫 질문 작성하기
          </Link>
        </div>
      )}

      {/* 빠른 액션 */}
      <div className="flex gap-2">
        <Link
          href="/questions/new"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
        >
          질문 작성
        </Link>
        <Link
          href="/questions/analytics"
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
        >
          분석 보기
        </Link>
      </div>
    </div>
  );
};

export default DashboardQuestionWidget;
