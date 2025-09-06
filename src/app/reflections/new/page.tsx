'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import ReflectionForm from '@/components/reflections/ReflectionForm';
import { useAuth } from '@/hooks/auth';
import { useReflections } from '@/hooks/reflections/useReflections';
import { ReflectionFormData } from '@/types/reflections';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
          router.push('/reflections');
        },
        onError: (error) => {
          console.error('회고 작성 실패:', error);
          setError('회고 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성된 내용이 사라집니다.')) {
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
            회고 목록으로 돌아가기
          </Link>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-accent-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            새로운 회고 작성
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            오늘 하루를 되돌아보며 감사함과 배움을 기록해보세요. 작은 순간들도
            소중한 성장의 기록이 됩니다.
          </p>
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

        {/* 도움말 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">회고 작성 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 감사: 오늘 감사했던 순간, 사람, 경험을 적어보세요</li>
            <li>
              • 성찰: 배운 점, 아쉬웠던 점, 내일 다르게 하고 싶은 것들을
              정리해보세요
            </li>
            <li>
              • 키워드: 나중에 쉽게 찾을 수 있도록 관련 키워드를 추가해보세요
            </li>
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
};

export default NewReflectionPage;
