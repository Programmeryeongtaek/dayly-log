'use client';

import Modal from '@/components/common/Modal';
import QuestionForm from '@/components/questions/QuestionForm';
import { useAuth } from '@/hooks/auth';
import { useQuestions } from '@/hooks/questions/useQuestions';
import { QuestionFormData } from '@/types/questions';
import {
  getAnswerStatus,
  getAnswerStatusLabel,
} from '@/utils/questions/helpers';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Edit,
  MessageCircle,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useMemo, useState } from 'react';

interface QuestionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const QuestionDetailPage = ({ params }: QuestionDetailPageProps) => {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    questions,
    isLoading,
    error,
    updateQuestion,
    deleteQuestion,
    isUpdatingQuestion,
    isDeletingQuestion,
  } = useQuestions({
    userId: user?.id,
  });

  // 현재 질문 찾기
  const question = useMemo(
    () => questions.find((q) => q.id === id),
    [questions, id]
  );

  const isOwner = question?.user_id === user?.id;

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!question) return;

    if (confirm('정말 이 질문을 삭제하시겠습니까?')) {
      try {
        await deleteQuestion(question.id);
        router.push('/questions');
      } catch (error) {
        console.error('질문 삭제 실패:', error);
        alert('질문 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleShare = async () => {
    if (!question) return;

    const shareData = {
      title: question.title,
      text: question.content || '질문을 확인해보세요.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  const handleUpdateQuestion = async (formData: QuestionFormData) => {
    if (!question) return;

    try {
      await updateQuestion({
        id: question.id,
        ...formData,
      });
      setShowEditModal(false);
    } catch (error) {
      console.error('질문 수정 실패:', error);
      alert('질문 수정 중 오류가 발생했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 질문을 찾을 수 없음
  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😵</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            질문을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            요청하신 질문이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            href="/questions"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            질문 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Link
          href="/questions"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          {/* 헤더 정보 */}
          <div className="flex flex-col border-accent-400 border-b-2 pb-4 gap-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 flex-1">
                {/* 답변 상태 */}
                <span
                  title={getAnswerStatusLabel(question.is_answered)}
                  className="text-lg"
                >
                  {getAnswerStatus(question.is_answered)}
                </span>

                {/* 날짜 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(question.date), 'yyyy. M. d.')}</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="공유"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {isOwner && (
                  <div className="flex items-center gap-3 ">
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeletingQuestion}
                      className="flex items-center gap-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 카테고리 배지 */}
            <div>
              <span className="px-3 py-1 bg-accent-200 text-gray-800 rounded-full font-medium">
                {question.category?.display_name || '알 수 없음'}
              </span>
            </div>
          </div>

          {/* 바디 */}
          <div className="flex flex-col gap-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">
              {question.title}
            </h1>

            {/* 내용 */}
            {question.content && (
              <div className="prose prose-sm max-w-none min-h-[100px]">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
            )}

            {/* 키워드 */}
            {question.keywords && question.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword) => (
                  <span
                    key={keyword.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${keyword.color}20`,
                      color: keyword.color,
                      border: `1px solid ${keyword.color}40`,
                    }}
                  >
                    {keyword.name}
                  </span>
                ))}
              </div>
            )}

            {/* 푸터 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-semibold text-gray-800">답변</h3>
              </div>
              {question.answer ? (
                <div className="bg-accent-50 rounded-lg p-4">
                  <p className="text-accent-900 leading-relaxed whitespace-pre-wrap">
                    {question.answer}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500">
                    아직 답변이 작성되지 않았습니다.
                  </p>
                  {isOwner && (
                    <button
                      onClick={handleEdit}
                      className="mt-2 text-accent-400 hover:cursor-pointer hover:text-accent-600"
                    >
                      답변 작성
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 작성자 정보 */}
          {!isOwner && question.author_name && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                작성자: {question.author_nickname || question.author_name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 편집 모달 */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          size="lg"
        >
          <Modal.Header className="border-b-2 border-accent-500">
            <Modal.Title className="flex items-center justify-between">
              <p className="text-accent-400">편집</p>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QuestionForm
              initialData={{
                title: question.title,
                content: question.content,
                answer: question.answer,
                category_id: question.category_id,
                date: question.date,
                is_public: question.is_public,
                is_neighbor_visible: question.is_neighbor_visible,
                is_answered: question.is_answered,
                keywords: question.keywords?.map((k) => k.name) || [],
              }}
              onSubmit={handleUpdateQuestion}
              onCancel={() => setShowEditModal(false)}
              isLoading={isUpdatingQuestion}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default QuestionDetailPage;
