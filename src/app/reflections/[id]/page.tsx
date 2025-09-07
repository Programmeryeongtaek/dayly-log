'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { useReflections } from '@/hooks/reflections/useReflections';
import { supabase } from '@/lib/supabase';
import { ReflectionWithKeywords } from '@/types/reflections';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Eye,
  Heart,
  Lightbulb,
  Lock,
  Share2,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface KeywordRelation {
  keyword: {
    id: string;
    name: string;
    color: string;
    category_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };
}

const ReflectionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { deleteReflection, isDeletingReflection } = useReflections({
    userId: user?.id,
  });

  const [reflection, setReflection] = useState<ReflectionWithKeywords | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 개별 회고 조회
  useEffect(() => {
    const fetchReflection = async () => {
      if (!id || !user?.id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reflections')
          .select(
            `
            *,
            category:reflection_categories(*),
            keywords:reflection_keyword_relations(
              keyword:reflection_keywords(*)
            )
          `
          )
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          setError('회고를 찾을 수 없습니다.');
          return;
        }

        // 접근 권한 체크
        const isOwn = data.user_id === user.id;
        const isPublic = data.is_public && data.is_neighbor_visible;

        if (!isOwn && !isPublic) {
          setError('이 회고에 접근할 권한이 없습니다.');
          return;
        }

        // 데이터 변환
        const keywords =
          data.keywords?.map((rk: KeywordRelation) => rk.keyword) || [];
        const effective_visibility: 'public' | 'neighbors' | 'private' =
          data.is_public && data.is_neighbor_visible
            ? 'public'
            : data.is_public && !data.is_neighbor_visible
              ? 'neighbors'
              : 'private';

        setReflection({
          ...data,
          keywords,
          effective_visibility,
          is_own: isOwn,
        });
      } catch (err) {
        console.error('회고 조회 실패:', err);
        setError('회고를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReflection();
  }, [id, user?.id]);

  const handleDelete = () => {
    if (!reflection) return;

    if (confirm('정말 삭제하시겠습니까? 삭제된 회고는 복구할 수 없습니다.')) {
      deleteReflection(reflection.id);
      router.push('./reflections');
    }
  };

  const handleShare = async () => {
    if (!reflection) return;

    if (reflection.effective_visibility === 'private') {
      alert('비공개 회고는 공유할 수 없습니다.');
      return;
    }

    try {
      await navigator.share({
        title: reflection.title || '회고',
        text: reflection.content.slice(1, 100) + '...',
        url: window.location.href,
      });
    } catch {
      // Web Share API를 지원하지 않는 경우 URL 복사
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const getVisibilityInfo = (
    visibility: 'public' | 'neighbors' | 'private'
  ) => {
    switch (visibility) {
      case 'public':
        return {
          icon: Eye,
          label: '전체 공개',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'neighbors':
        return {
          icon: User,
          label: '이웃 공개',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'private':
        return {
          icon: Lock,
          label: '비공개',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-500">회고를 보려면 먼저 로그인해주세요.</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg p-6 border">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !reflection) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {error || '회고를 찾을 수 없습니다'}
            </h3>
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              회고 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const isGratitude = reflection.category?.name === 'gratitude';
  const TypeIcon = isGratitude ? Heart : Lightbulb;
  const visibilityInfo = getVisibilityInfo(reflection.effective_visibility);
  const VisibilityIcon = visibilityInfo.icon;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/reflections"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm border">
          {/* 헤더 */}
          <div className="flex justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${visibilityInfo.bgColor} ${visibilityInfo.color}`}
              >
                <VisibilityIcon className="w-3 h-3" />
                {visibilityInfo.label}
              </div>
            </div>
            {/* 액션 버튼 */}
            {reflection.is_own && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="공유"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <Link
                  href={`/reflections/${reflection.id}/edit`}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeletingReflection}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col pb-2 border-b">
            <div className="flex gap-2 items-center">
              <div
                className={`p-3 rounded-lg ${isGratitude ? 'bg-orange-100' : 'bg-blue-100'}`}
              >
                <TypeIcon
                  className={`w-6 h-6 ${isGratitude ? 'text-orange-600' : 'text-blue-600'}`}
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(reflection.created_at), 'yyyy. M. d. HH:mm')}
                </div>
                <span
                  className={`text-sm font-medium ${isGratitude ? 'text-orange-600' : 'text-blue-600'}`}
                >
                  {reflection.category?.display_name}
                </span>
              </div>
            </div>
          </div>

          {/* 바디 */}
          <div className="flex flex-col min-h-[200px] gap-2">
            <div className="flex justify-end text-sm text-gray-500">
              {reflection.updated_at !== reflection.created_at && (
                <span>
                  수정일:{' '}
                  {format(new Date(reflection.updated_at), 'yyyy. M. d. HH:mm')}
                </span>
              )}
            </div>
            {/* 제목 */}
            {reflection.title && (
              <h1 className="text-2xl font-bold text-gray-900">
                {reflection.title}
              </h1>
            )}
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
              {reflection.content}
            </div>
          </div>

          {/* 키워드 */}
          {reflection.keywords.length > 0 && (
            <div className="bg-gray-50 border-t pt-2 rounded-b-lg">
              <div className="flex flex-wrap gap-2">
                {reflection.keywords.map((keyword) => (
                  <Link
                    key={keyword.id}
                    href={`/reflections?keywords=${encodeURIComponent(keyword.name)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `${keyword.color}20`,
                      color: keyword.color,
                    }}
                  >
                    #{keyword.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default ReflectionDetailPage;
