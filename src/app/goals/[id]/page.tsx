"use client";

import ActionButtons from "@/components/goals/ActionButton";
import InfoSection, { InfoItem } from "@/components/goals/InfoSection";
import ProgressBar from "@/components/goals/ProgressBar";
import StatusBadge from "@/components/goals/StatusBadge";
import { useAuth } from "@/hooks/auth";
import { useGoals } from "@/hooks/goals/useGoals";
import { supabase } from "@/lib/supabase";
import {
  getChallengeMode,
  getGoalProgress,
  getTypeText,
} from "@/utils/goals/goalsHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Calendar, Info, Target } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const GoalDetailPage = () => {
  const { user } = useAuth();
  const { goals } = useGoals({ userId: user?.id });
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const goalId = params.id as string;
  const goal = goals.find((g) => g.id === goalId);

  const handleEdit = () => {
    router.push(`/goals/${goalId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 목표를 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);

      if (error) {
        console.error("목표 삭제 실패:", error);
        alert("목표 삭제에 실패했습니다.");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["goals"] });
      alert("목표가 성공적으로 삭제되었습니다.");
      router.push("/goals");
    } catch (error) {
      console.error("목표 삭제 오류:", error);
      alert("목표 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-gray-100">
          <div className="p-4 bg-gradient-to-br from-accent-500 to-accent-400 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">목표 상세</h1>
          <p className="text-gray-600 mb-6">로그인이 필요한 서비스입니다.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  // 목표를 찾을 수 없는 경우
  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-gray-100">
          <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            목표를 찾을 수 없습니다.
          </h1>
          <p className="text-gray-600 mb-6">
            요청한 목표가 존재하지 않거나 삭제되었습니다.
          </p>
          <button
            onClick={() => router.push("/goals")}
            className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            목표 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 진행률 계산
  const progress = getGoalProgress(goal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center">
          <button
            onClick={() => router.push("/goals")}
            className="hover:text-accent-500 text-gray-800 hover:cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-r from-accent-400 to-accent-600 py-6 px-4 text-white relative">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex justify-end pt-4">
                <StatusBadge
                  status={goal.status}
                  targetDate={goal.target_date}
                  className="top-2 right-2 absolute"
                />
              </div>
              <h1 className="text-2xl font-bold">{goal.title}</h1>
              {goal.description && (
                <p className="text-white text-lg leading-relaxed">
                  {goal.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* 기본 정보 */}
            <InfoSection title="기본 정보" icon={<Info className="w-5 h-5" />}>
              <div className="flex items-center justify-end gap-2 border-b border-accent-300">
                {goal.category && (
                  <InfoItem label="" value={goal.category.name} important />
                )}
                <InfoItem label="" value={getTypeText(goal.type)} important />({" "}
                <InfoItem
                  label=""
                  value={getChallengeMode(goal.challenge_mode)}
                />
                )
              </div>

              {goal.category && (
                <InfoItem
                  label={
                    goal.type === "reduce_expense" ? "현재 사용" : "현재 달성"
                  }
                  value={`${goal.current_amount?.toLocaleString()}원`}
                  important
                />
              )}
              {goal.reason && <InfoItem label="" value={goal.reason} />}
            </InfoSection>

            {/* 목표 정보 */}
            <InfoSection
              title="목표 정보"
              icon={<Target className="w-5 h-5" />}
            >
              <div className="flex gap-2 items-center justify-end border-b border-accent-300">
                {goal.created_from_date && (
                  <InfoItem
                    label=""
                    value={format(
                      new Date(goal.created_from_date),
                      "yy. MM. dd.",
                      {
                        locale: ko,
                      },
                    )}
                    important
                  />
                )}{" "}
                ~
                {goal.target_date && (
                  <InfoItem
                    label=""
                    value={format(new Date(goal.target_date), "yy. MM. dd.", {
                      locale: ko,
                    })}
                    important
                  />
                )}
              </div>
              {goal.target_amount && goal.current_amount !== undefined && (
                <ProgressBar
                  current={goal.current_amount}
                  target={goal.target_amount}
                  type={goal.type}
                  title="금액 달성률"
                  unit="원"
                />
              )}

              {goal.target_count && goal.current_count !== undefined && (
                <div className={goal.target_amount ? "mt-6" : ""}>
                  <ProgressBar
                    current={goal.current_count}
                    target={goal.target_count}
                    type={goal.type}
                    title="횟수 달성률"
                    unit="회"
                  />
                </div>
              )}

              {/* 종합 진행률 (둘 다 있을 때만) */}
              {goal.target_amount && goal.target_count && (
                <div className="mt-6 p-4 bg-gradient-to-r from-accent-100 to-accent-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      종합 달성률
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                      {progress.overallProgress}%
                    </span>
                  </div>
                </div>
              )}
            </InfoSection>

            {/* 날짜 정보 */}
            <InfoSection
              title="생성 정보"
              icon={<Calendar className="w-5 h-5" />}
            >
              <InfoItem
                label="생성일"
                value={format(new Date(goal.created_at), "yy. MM. dd. HH:mm", {
                  locale: ko,
                })}
              />
              <InfoItem
                label="마지막 수정일"
                value={format(new Date(goal.updated_at), "yy. MM. dd. HH:mm", {
                  locale: ko,
                })}
              />
            </InfoSection>

            {/* 액션 버튼 */}
            <div className="flex justify-end">
              <ActionButtons
                goalStatus={goal.status}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailPage;
