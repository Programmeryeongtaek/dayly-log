'use client';

import { useAuth } from '@/hooks/auth';
import { useGoals } from '@/hooks/goals/useGoals';
import { useParams, useRouter } from 'next/navigation';

const GoalDetailPage = () => {
  const { user } = useAuth();
  const { goals, isLoading } = useGoals({ userId: user?.id });
  const params = useParams();
  const router = useRouter();

  const goalId = params.id as string;
  const goal = goals.find((g) => g.id === goalId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div>
        <h1>목표 상세</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div>
        <h1>목표 상세</h1>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  // 목표를 찾을 수 없는 경우
  if (!goal) {
    return (
      <div>
        <h1>목표 상세</h1>
        <p>목표를 찾을 수 없습니다.</p>
        <button onClick={() => router.push('/goals')}>
          목표 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/goals/${goalId}/edit`);
  };

  const handleDelete = () => {
    if (confirm('정말로 이 목표를 삭제하시겠습니까?')) {
      // TODO: 목표 삭제 구현
      console.log('목표 삭제:', goalId);
      router.push('/goals');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행 중';
      case 'completed':
        return '완료됨';
      case 'paused':
        return '일시정지';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'save_money':
        return '돈 저축';
      case 'reduce_expense':
        return '지출 줄이기';
      case 'increase_income':
        return '수입 늘리기';
      case 'custom':
        return '사용자 정의';
      default:
        return type;
    }
  };

  const getChallengeMode = (mode: string) => {
    switch (mode) {
      case 'amount':
        return '금액';
      case 'count':
        return '횟수';
      case 'both':
        return '금액 + 횟수';
      default:
        return mode;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => router.push('/goals')}>
          ← 목표 목록으로 돌아가기
        </button>
      </div>

      <h1>{goal.title}</h1>

      {/* 기본 정보 */}
      <div style={{ marginBottom: '30px' }}>
        <h2>기본 정보</h2>
        <div>
          <p>
            <strong>설명:</strong> {goal.description || '설명 없음'}
          </p>
          <p>
            <strong>이유:</strong> {goal.reason || '이유 없음'}
          </p>
          <p>
            <strong>타입:</strong> {getTypeText(goal.type)}
          </p>
          <p>
            <strong>상태:</strong> {getStatusText(goal.status)}
          </p>
          <p>
            <strong>챌린지 모드:</strong>{' '}
            {getChallengeMode(goal.challenge_mode)}
          </p>
          {goal.category && (
            <p>
              <strong>카테고리:</strong> {goal.category.name}
            </p>
          )}
        </div>
      </div>

      {/* 목표 정보 */}
      <div style={{ marginBottom: '30px' }}>
        <h2>목표 정보</h2>
        <div>
          {goal.target_amount && (
            <p>
              <strong>목표 금액:</strong> {goal.target_amount.toLocaleString()}
              원
              {goal.current_amount !== undefined && (
                <span> (현재: {goal.current_amount.toLocaleString()}원)</span>
              )}
            </p>
          )}
          {goal.target_count && (
            <p>
              <strong>목표 횟수:</strong> {goal.target_count}회
              {goal.current_count !== undefined && (
                <span> (현재: {goal.current_count}회)</span>
              )}
            </p>
          )}
          {goal.target_date && (
            <p>
              <strong>목표 날짜:</strong>{' '}
              {new Date(goal.target_date).toLocaleDateString()}
            </p>
          )}
          {goal.created_from_date && (
            <p>
              <strong>시작 날짜:</strong>{' '}
              {new Date(goal.created_from_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* 진행률 */}
      {goal.target_amount && goal.current_amount !== undefined && (
        <div style={{ marginBottom: '30px' }}>
          <h2>금액 진행률</h2>
          <div>
            <p>
              진행률:{' '}
              {((goal.current_amount / goal.target_amount) * 100).toFixed(1)}%
            </p>
            <div
              style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor:
                    goal.type === 'increase_income' ? '#22c55e' : '#ef4444',
                  borderRadius: '10px',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 횟수 진행률 */}
      {goal.target_count && goal.current_count !== undefined && (
        <div style={{ marginBottom: '30px' }}>
          <h2>횟수 진행률</h2>
          <div>
            <p>
              진행률:{' '}
              {((goal.current_count / goal.target_count) * 100).toFixed(1)}%
            </p>
            <div
              style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min((goal.current_count / goal.target_count) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor:
                    goal.type === 'increase_income' ? '#22c55e' : '#ef4444',
                  borderRadius: '10px',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 날짜 정보 */}
      <div style={{ marginBottom: '30px' }}>
        <h2>날짜 정보</h2>
        <div>
          <p>
            <strong>생성일:</strong>{' '}
            {new Date(goal.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>수정일:</strong>{' '}
            {new Date(goal.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      {goal.status === 'active' && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleEdit}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalDetailPage;
