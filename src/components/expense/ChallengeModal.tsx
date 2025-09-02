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
  enableAmountGoal: boolean;
  enableCountGoal: boolean;
  targetAmount: string;
  targetCount: string;
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
    count?: number;
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
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: `${expenseData.name} 챌린지`,
    description: '',
    reason: '',
    enableAmountGoal: true,
    enableCountGoal: (expenseData.count || 0) > 1,
    targetAmount: Math.max(1, Math.floor(expenseData.amount * 0.1)).toString(),
    targetCount: expenseData.count
      ? Math.max(1, expenseData.count - 1).toString()
      : '1',
    duration: '1month',
    targetDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  });

  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // 폼 데이터 업데이트 핸들러
  const handleFormDataChange = <K extends keyof ChallengeFormData>(
    field: K,
    value: ChallengeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 체크박스 핸들러
  const handleCheckboxChange =
    (field: 'enableAmountGoal' | 'enableCountGoal') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFormDataChange(field, e.target.checked);
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
      category: '가계부',
    });
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    const hasAtLeastOneGoal =
      formData.enableAmountGoal || formData.enableCountGoal;
    const amountValid =
      !formData.enableAmountGoal ||
      (formData.targetAmount &&
        Number(formData.targetAmount) > 0 &&
        Number(formData.targetAmount) < expenseData.amount);
    const countValid =
      !formData.enableCountGoal ||
      (formData.targetCount && Number(formData.targetCount) > 0);

    return (
      formData.title.trim() &&
      formData.reason.trim() &&
      formData.targetDate &&
      hasAtLeastOneGoal &&
      amountValid &&
      countValid
    );
  };

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    setFormData({
      title: `${expenseData.name} 챌린지`,
      description: '',
      reason: '',
      enableAmountGoal: true,
      enableCountGoal: (expenseData.count || 0) > 1,
      targetAmount: Math.max(
        1,
        Math.floor(expenseData.amount * 0.1)
      ).toString(),
      targetCount: expenseData.count
        ? Math.max(1, expenseData.count - 1).toString()
        : '1',
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
            <Modal.Title>챌린지 생성</Modal.Title>
            <Modal.Description>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                설정한 목표 중 <strong>하나만 달성해도 성공</strong>입니다.
              </div>
            </Modal.Description>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        <form onSubmit={handleSubmit} id="challenge-form">
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

          {/* 목표 타입 선택 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              목표 *
            </label>
            {/* 기존 지출 정보 표시 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                대상 지출
                {expenseData.count && (
                  <div className="text-xs text-gray-500">
                    {expenseData.count}건
                  </div>
                )}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{expenseData.name}</span>
                <div className="text-right">
                  <span className="font-semibold text-accent-600">
                    {expenseData.amount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 금액 목표 체크박스 */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableAmountGoal}
                  onChange={handleCheckboxChange('enableAmountGoal')}
                  className="mt-1 w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 rounded focus:ring-accent-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">💰 금액 줄이기</span>

                  {formData.enableAmountGoal && (
                    <div className="mt-2 space-y-1">
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.targetAmount}
                          onChange={(e) =>
                            handleFormDataChange('targetAmount', e.target.value)
                          }
                          placeholder="35450"
                          min="1"
                          max={expenseData.amount - 1}
                          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
                          required={formData.enableAmountGoal}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                          원
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          Number(formData.targetAmount) >= expenseData.amount
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {Number(formData.targetAmount) >= expenseData.amount ? (
                          <>
                            ⚠️ 절약 목표는 현재 지출(
                            {expenseData.amount.toLocaleString()}원)보다 작아야
                            합니다
                          </>
                        ) : (
                          <>
                            현재 지출의{' '}
                            {Math.round(
                              (Number(formData.targetAmount) /
                                expenseData.amount) *
                                100
                            )}
                            % 절약 목표 ({expenseData.amount.toLocaleString()}원
                            →{' '}
                            {(
                              expenseData.amount - Number(formData.targetAmount)
                            ).toLocaleString()}
                            원)
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* 횟수 목표 체크박스 */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableCountGoal}
                  onChange={handleCheckboxChange('enableCountGoal')}
                  disabled={(expenseData.count || 0) <= 1}
                  className={`mt-1 w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 rounded focus:ring-accent-500 ${
                    (expenseData.count || 0) <= 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">📊 횟수 줄이기</span>

                  {formData.enableCountGoal && (
                    <div className="mt-2 space-y-1">
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.targetCount}
                          onChange={(e) =>
                            handleFormDataChange('targetCount', e.target.value)
                          }
                          placeholder="5"
                          min="1"
                          max={expenseData.count ? expenseData.count - 1 : 1}
                          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
                          required={formData.enableCountGoal}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                          회 이하
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {expenseData.count
                          ? `현재 월 ${expenseData.count}회에서 ${formData.targetCount}회로 줄이기 (${Math.round(((expenseData.count - Number(formData.targetCount)) / expenseData.count) * 100)}% 감소)`
                          : `월간 ${formData.targetCount}회 이하로 지출 제한`}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* 챌린지 기간 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              기간 *
            </label>

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

            {isCustomDuration && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  종료 날짜
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

          {/* 추가 설명 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              계획 (선택)
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
