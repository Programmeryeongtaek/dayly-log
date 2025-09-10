"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import { useAuth } from "@/hooks/auth";
import { useReflections } from "@/hooks/reflections/useReflections";
import { ReflectionFormData } from "@/types/reflections";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NewReflectionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createReflectionMutation } = useReflections({
    userId: user?.id,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: ReflectionFormData) => {
    if (!user?.id) return;

    setError(null);
    createReflectionMutation.mutate(
      { ...formData, user_id: user.id },
      {
        onSuccess: () => {
          router.push("/reflections");
        },
        onError: (error) => {
          console.error("회고 작성 실패:", error);
          setError("회고 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  const handleCancel = () => {
    if (confirm("작성을 취소하시겠습니까? 작성된 내용이 사라집니다.")) {
      router.back();
    }
  };

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-500 mb-6">
              회고를 작성하려면 먼저 로그인해주세요.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* 브레드크럼 네비게이션 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/reflections"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-red-500">⚠️</div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 작성 폼 */}
        <ReflectionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createReflectionMutation.isPending}
          mode="create"
        />
      </div>
    </AuthGuard>
  );
};

export default NewReflectionPage;
