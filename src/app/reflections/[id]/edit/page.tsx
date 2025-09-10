"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import { useAuth } from "@/hooks/auth";
import { useReflections } from "@/hooks/reflections/useReflections";
import { ReflectionFormData } from "@/types/reflections";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ReflectionEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const reflectionId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { reflections, updateReflection, isLoading } = useReflections({
    userId: user?.id,
  });

  // 수정할 회고 찾기
  const reflection = useMemo(() => {
    return reflections.find((r) => r.id === reflectionId);
  }, [reflections, reflectionId]);

  // 권한 확인 - 본인의 회고인지 체크
  const canEdit = useMemo(() => {
    if (!reflection || !user) return false;
    return reflection.user_id === user.id;
  }, [reflection, user]);

  // 폼 데이터 초기값 설정
  const initialData = useMemo((): Partial<ReflectionFormData> | undefined => {
    if (!reflection) return undefined;

    return {
      title: reflection.title || "",
      content: reflection.content,
      category_id: reflection.category_id,
      date: reflection.date,
      is_public: reflection.is_public,
      is_neighbor_visible: reflection.is_neighbor_visible,
      keywords: reflection.keywords?.map((k) => k.name) || [],
    };
  }, [reflection]);

  // 수정 처리
  const handleSubmit = async (formData: ReflectionFormData) => {
    if (!reflection || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateReflection({
        id: reflection.id,
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id,
        date: formData.date,
        is_public: formData.is_public,
        is_neighbor_visible: formData.is_neighbor_visible,
        keywords: formData.keywords,
      });

      // 성공 시 회고 목록으로 이동
      router.push("/reflections");
    } catch (err) {
      setError("회고 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Failed to update reflection:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push("/reflections");
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
              <span className="ml-2 text-gray-600">회고를 불러오는 중...</span>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // 회고를 찾을 수 없는 경우
  if (!reflection) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              회고를 찾을 수 없습니다.
            </h2>
            <p className="text-gray-500 mb-6">
              요청하신 회고가 존재하지 않거나 삭제되었습니다.
            </p>
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // 권한이 없는 경우
  if (!canEdit) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              수정 권한이 없습니다.
            </h2>
            <p className="text-gray-500 mb-6">
              본인이 작성한 회고만 수정할 수 있습니다.
            </p>
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link
                href="/reflections"
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 수정 폼 */}
        {initialData && (
          <ReflectionForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default ReflectionEditPage;
