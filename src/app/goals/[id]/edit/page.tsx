"use client";

import { useAuth } from "@/hooks/auth";
import { useGoals } from "@/hooks/goals/useGoals";
import { GoalFormData } from "@/types/goals";
import {
  getChallengeMode,
  getStatusText,
  getTypeText,
} from "@/utils/goals/goalsHelpers";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  Edit3,
  HandCoins,
  Hash,
  Save,
  Target,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface GoalEditFormData {
  title: string;
  description: string;
  reason: string;
  target_amount: string;
  target_count: string;
  target_date: string;
  status: "active" | "completed" | "paused" | "cancelled";
  challenge_mode: "amount" | "count" | "both";
}

const GoalEditPage = () => {
  const { user } = useAuth();
  const {
    goals,
    isLoading: isGoalsLoading,
    updateGoal,
    isUpdatingGoal,
  } = useGoals({ userId: user?.id });
  const params = useParams();
  const router = useRouter();

  const goalId = params.id as string;
  const goal = goals.find((g) => g.id === goalId);

  const [formData, setFormData] = useState<GoalEditFormData>({
    title: "",
    description: "",
    reason: "",
    target_amount: "",
    target_count: "",
    target_date: "",
    status: "active",
    challenge_mode: "amount",
  });

  const [errors, setErrors] = useState<Partial<GoalEditFormData>>({});

  // 목표 데이터로 폼 초기화
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        reason: goal.reason || "",
        target_amount: goal.target_amount ? goal.target_amount.toString() : "",
        target_count: goal.target_count ? goal.target_count.toString() : "",
        target_date: goal.target_date
          ? format(new Date(goal.target_date), "yyyy-MM-dd")
          : "",
        status: goal.status,
        challenge_mode: goal.challenge_mode,
      });
    }
  }, [goal]);

  const handleInputChange = (field: keyof GoalEditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<GoalEditFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "목표 제목은 필수 입니다.";
    }

    if (
      formData.challenge_mode === "amount" ||
      formData.challenge_mode === "both"
    ) {
      if (!formData.target_amount || Number(formData.target_amount) <= 0) {
        newErrors.target_amount = "목표 금액을 올바르게 입력해주세요.";
      }
    }

    if (
      formData.challenge_mode === "count" ||
      formData.challenge_mode === "both"
    ) {
      if (!formData.target_count || Number(formData.target_count) <= 0) {
        newErrors.target_count = "목표 횟수를 올바르게 입력해주세요.";
      }
    }

    if (!formData.target_date) {
      newErrors.target_date = "목표 날짜는 필수입니다.";
    } else {
      const targetDate = new Date(formData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (targetDate < today) {
        newErrors.target_date = "목표 날짜는 오늘 이후여야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updateData: Partial<GoalFormData> = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      reason: formData.reason.trim() || null,
      target_date: formData.target_date || null,
      status: formData.status,
      challenge_mode: formData.challenge_mode,
    };

    // 챌린지 모드에 따라 목표값 설정
    if (formData.challenge_mode === "amount") {
      updateData.target_amount = Number(formData.target_amount);
      updateData.target_count = null;
    } else if (formData.challenge_mode === "count") {
      updateData.target_count = Number(formData.target_count);
      updateData.target_amount = null;
    } else {
      updateData.target_amount = Number(formData.target_amount);
      updateData.target_count = Number(formData.target_count);
    }

    try {
      updateGoal({ id: goalId, updates: updateData });
      alert("목표가 성공적으로 수정되었습니다.");
      router.push(`/goals/${goalId}`);
    } catch (error) {
      console.error("목표 수정 실패:", error);
      alert("목표 수정에 실패했습니다.");
    }
  };

  // 로딩 상태
  if (isGoalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-accent-200 rounded-full animate-pulse" />
            <div className="absolute inset-0 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            목표를 불러오는 중
          </p>
          <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-gray-100">
          <div className="p-4 bg-gradient-to-br from-accent-500 to-accent-400 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">목표 수정</h1>
          <p className="text-gray-600 mb-6">로그인이 필요한 서비스입니다.</p>
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
            목표를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6">
            수정하려는 목표가 존재하지 않거나 삭제되었습니다.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 py-8">
        {/* 메인 폼 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-r from-accent-400 to-accent-600 py-6 px-4 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Edit3 className="w-8 h-8" />
              <h1 className="text-3xl font-bold">목표 수정</h1>
            </div>
            <div className="flex gap-4 text-sm">
              {goal.category && (
                <>
                  <span>{goal.category.name}</span>
                  <span>•</span>
                </>
              )}
              <span>{getTypeText(goal.type)}</span>
              <span>•</span>
              <span>{getStatusText(goal.status)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* 기본 정보 섹션 */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-600" />
                기본 정보
              </h2>

              <div className="space-y-6">
                {/* 목표 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <strong className="text-red-500">*</strong>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors hover:border-accent-300 ${
                      errors.title ? "border-red-500" : "border-gray-400"
                    }`}
                    placeholder="목표 제목을 작성하세요."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* 목표 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none hover:border-accent-300"
                    placeholder="목표에 대한 자세한 설명을 작성하세요."
                  />
                </div>

                {/* 목표 이유 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이유
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none hover:border-accent-300"
                    placeholder="목표를 설정한 이유를 간단히 적어보세요."
                  />
                </div>

                {/* 목표 상태 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-300 hover:cursor-pointer"
                  >
                    <option value="active">진행 중</option>
                    <option value="completed">완료됨</option>
                    <option value="paused">일시정지</option>
                    <option value="cancelled">취소됨</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 목표 설정 섹션 */}
            <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 ">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-600" />
                목표 설정
              </h2>

              <div className="flex flex-col gap-6">
                {/* 챌린지 모드 */}
                <div className="grid grid-cols-3 gap-4">
                  {(["amount", "count", "both"] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.challenge_mode === mode
                          ? "border-accent-500 bg-accent-50"
                          : "border-gray-300 hover:border-accent-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={mode}
                        checked={formData.challenge_mode === mode}
                        onChange={(e) =>
                          handleInputChange("challenge_mode", e.target.value)
                        }
                        className="hidden"
                      />
                      <span className="text-sm font-medium">
                        {getChallengeMode(mode)}
                      </span>
                    </label>
                  ))}
                </div>

                {/* 목표 금액 */}
                {(formData.challenge_mode === "amount" ||
                  formData.challenge_mode === "both") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      금액 <strong className="text-red-500">*</strong>
                    </label>
                    <div className="relative">
                      <HandCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-500" />
                      <input
                        type="number"
                        value={formData.target_amount}
                        onChange={(e) =>
                          handleInputChange("target_amount", e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                          errors.target_amount
                            ? "border-red-500"
                            : "border-gray-400 hover:border-accent-400"
                        }`}
                        placeholder="목표 금액을 입력하세요."
                        min="1"
                      />
                      <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-accent-600">
                        원
                      </span>
                    </div>
                    {errors.target_amount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.target_amount}
                      </p>
                    )}
                  </div>
                )}

                {/* 목표 횟수 */}
                {(formData.challenge_mode === "count" ||
                  formData.challenge_mode === "both") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      횟수 <strong className="text-red-500">*</strong>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-500" />
                      <input
                        type="number"
                        value={formData.target_count}
                        onChange={(e) =>
                          handleInputChange("target_count", e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                          errors.target_count
                            ? "border-red-500"
                            : "border-gray-400 hover:border-accent-400"
                        }`}
                        placeholder="목표 횟수를 입력하세요."
                        min="1"
                      />
                      <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-accent-600">
                        회
                      </span>
                    </div>
                    {errors.target_count && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.target_count}
                      </p>
                    )}
                  </div>
                )}

                {/* 목표 날짜 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    완료일 <strong className="text-red-500">*</strong>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-500" />
                    <input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) =>
                        handleInputChange("target_date", e.target.value)
                      }
                      className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors hover:cursor-pointer ${
                        errors.target_date
                          ? "border-red-500"
                          : "border-gray-400 hover:border-accent-400"
                      }`}
                    />
                  </div>
                  {errors.target_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.target_date}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push(`/goals/${goalId}`)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer"
              >
                <X className="w-4 h-4" />
                취소
              </button>
              <button
                type="submit"
                disabled={isUpdatingGoal}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform shadow-lg ${
                  isUpdatingGoal
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-accent-400 to-accent-600 text-white hover:shadow-xl hover:-translate-y-1 hover:cursor-pointer"
                }`}
              >
                <Save className="w-4 h-4" />
                {isUpdatingGoal ? "저장 중..." : "수정"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalEditPage;
