'use client';

import { addDays, addMonths, format } from 'date-fns';
import { useState } from 'react';
import Modal from '../common/Modal';
import { Calendar, Target, TrendingDown } from 'lucide-react';
import { ko } from 'date-fns/locale';

interface ChallengeFormData {
  title: string;
  description: string;
  reason: string;
  targetAmount: string; // TODO: 카테고리에 따라 필요하지 않을 수도 있음. 검토바람
  duration: string;
  targetDate: string;
}

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChallengeFormData & { category: string }) => void;
  expenseData: {
    name: string;
    amount: number;
    category: string;
  };
  isSubmitting?: boolean;
}

// 미리 정의된 기간 옵션
const DURATION_PRESETS = [
  { label: '1주일', value: '1week', days: 7 },
  { label: '2주일', value: '2weeks', days: 14 },
  { label: '1개월', value: '1month', days: 30 },
  { label: '3개월', value: '3months', days: 90 },
  { label: '6개월', value: '6months', days: 180 },
  { label: '직접 입력', value: 'custom', days: 0 },
] as const;

const ChallengeModal = ({
  isOpen,
  onClose,
  onSubmit,
  expenseData,
  isSubmitting = false,
}: ChallengeModalProps) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: `${expenseData.name} 챌린지`,
    description: '',
    reason: '',
    targetAmount: '',
    duration: '1month',
    targetDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // 폼 데이터 업데이트 핸들러
  const handleFormDataChange = (
    field: keyof ChallengeFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 기간 선택 핸들러
  const handleDurationChange = (duration: string) => {
    const isCustom = duration === 'custom';
    setIsCustomDuration(isCustom);

    if (!isCustom) {
      const preset = DURATION_PRESETS.find((p) => p.value === duration);
      if (preset) {
        const targetDate = addDays(new Date(), preset.days);
        setFormData((prev) => ({
          ...prev,
          duration,
          targetDate: format(targetDate, 'yyyy-MM-dd'),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, duration }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: '가계부', // 지출에서 생성된 챌린지는 가계부 카테고리로 설정
    });
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.reason.trim() &&
      formData.targetAmount &&
      Number(formData.targetAmount) > 0 &&
      formData.targetDate
    );
  };

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    setFormData({
      title: `${expenseData.name} 줄이기 챌린지`,
      description: '',
      reason: '',
      targetAmount: Math.floor(expenseData.amount * 0.5).toString(),
      duration: '1month',
      targetDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    });
    setIsCustomDuration(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-100 rounded-lg">
            <Target className="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <Modal.Title>챌린지 만들기</Modal.Title>
            <Modal.Description>
              {expenseData.name}에 대한 절약 챌린지를 시작해보세요
            </Modal.Description>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        <form onSubmit={handleSubmit} id="challenge-form">
          {/* 기존 지출 정보 표시 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              대상 지출
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{expenseData.name}</span>
              <span className="font-semibold text-accent-600">
                {expenseData.amount.toLocaleString()}원
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              카테고리: {expenseData.category}
            </div>
          </div>

          {/* 챌린지 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormDataChange('title', e.target.value)}
              placeholder="예: 카페 지출 줄이기 챌린지"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm mobile:text-base"
              required
            />
          </div>

          {/* 챌린지 이유 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              이유 *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleFormDataChange('reason', e.target.value)}
              placeholder="예: 매월 카페 지출이 너무 많아서 가계에 부담이 되고 있어요. 건강한 소비 습관을 만들고 싶습니다."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm mobile:text-base resize-none"
              required
            />
          </div>

          {/* 목표 금액 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              목표 절약 금액 *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  handleFormDataChange('targetAmount', e.target.value)
                }
                placeholder="50000"
                min="1"
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm mobile:text-base"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                원
              </span>
            </div>
          </div>

          {/* 챌린지 기간 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              기간 *
            </label>

            {/* 기간 프리셋 선택 */}
            <div className="grid grid-cols-3 mobile:grid-cols-6 gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleDurationChange(preset.value)}
                  className={`
                    px-3 py-2 text-xs mobile:text-sm font-medium rounded-lg border transition-all duration-200
                    ${
                      formData.duration === preset.value
                        ? 'bg-accent-100 border-accent-300 text-accent-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* 커스텀 날짜 선택 */}
            {isCustomDuration && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  종료 날짜 선택
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) =>
                    handleFormDataChange('targetDate', e.target.value)
                  }
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm mobile:text-base"
                />
              </div>
            )}

            {/* 선택된 날짜 표시 */}
            <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>
                종료일:{' '}
                <strong>
                  {format(
                    new Date(formData.targetDate),
                    'yyyy년 M월 d일 (EEEE)',
                    { locale: ko }
                  )}
                </strong>
              </span>
            </div>
          </div>

          {/* 추가 설명 (선택사항) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              상세 설명 (선택사항)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                handleFormDataChange('description', e.target.value)
              }
              placeholder="예: 주 3회 이상 카페를 이용하지 않기, 집에서 커피 내려먹기 등 구체적인 실행 방법을 적어보세요."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm mobile:text-base resize-none"
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Modal.CloseButton>취소</Modal.CloseButton>
        <Modal.Button
          type="submit"
          form="challenge-form"
          disabled={!isFormValid()}
          loading={isSubmitting}
          className="mobile:order-first"
        >
          시작
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChallengeModal;
