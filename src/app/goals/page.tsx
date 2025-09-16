'use client';

import { useAuth } from '@/hooks/auth';
import { useGoals } from '@/hooks/goals/useGoals';

const GoalsPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    activeGoals,
    completedGoals,
    goals,
    isLoading: isGoalsLoading,
  } = useGoals({
    userId: user?.id,
  });

  // 로딩 상태
  if (isAuthLoading || isGoalsLoading) {
    return (
      <div>
        <h1>목표 관리</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div>
        <h1>목표 관리</h1>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>목표 관리</h1>

      {/* 기본 통계 */}
      <div>
        <h2>목표 현황</h2>
        <ul>
          <li>전체 목표: {goals.length}개</li>
          <li>진행 중인 목표: {activeGoals.length}개</li>
          <li>완료된 목표: {completedGoals.length}개</li>
        </ul>
      </div>

      {/* 진행 중인 목표들 */}
      <div>
        <h2>진행 중인 목표</h2>
        {activeGoals.length === 0 ? (
          <p>진행 중인 목표가 없습니다.</p>
        ) : (
          <ul>
            {activeGoals.map((goal) => (
              <li key={goal.id}>
                <div>
                  <h3>{goal.title}</h3>
                  <p>{goal.description}</p>
                  <p>타입: {goal.type}</p>
                  <p>상태: {goal.status}</p>
                  {goal.target_amount && (
                    <p>
                      목표 금액: {goal.target_amount.toLocaleString()}원
                      {goal.current_amount !== undefined && (
                        <span>
                          {' '}
                          (현재: {goal.current_amount.toLocaleString()}원)
                        </span>
                      )}
                    </p>
                  )}
                  {goal.target_count && (
                    <p>
                      목표 횟수: {goal.target_count}회
                      {goal.current_count !== undefined && (
                        <span> (현재: {goal.current_count}회)</span>
                      )}
                    </p>
                  )}
                  {goal.target_date && <p>목표 날짜: {goal.target_date}</p>}
                  {goal.challenge_mode && (
                    <p>
                      챌린지 모드:{' '}
                      {goal.challenge_mode === 'both'
                        ? '금액 + 횟수'
                        : goal.challenge_mode === 'amount'
                          ? '금액'
                          : '횟수'}
                    </p>
                  )}
                  {goal.category && <p>카테고리: {goal.category.name}</p>}
                  <p>
                    생성일: {new Date(goal.created_at).toLocaleDateString()}
                  </p>
                  <hr />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 완료된 목표들 */}
      {completedGoals.length > 0 && (
        <div>
          <h2>완료된 목표</h2>
          <ul>
            {completedGoals.map((goal) => (
              <li key={goal.id}>
                <div>
                  <h3>{goal.title}</h3>
                  <p>{goal.description}</p>
                  <p>타입: {goal.type}</p>
                  {goal.target_amount && (
                    <p>달성 금액: {goal.current_amount?.toLocaleString()}원</p>
                  )}
                  {goal.target_count && (
                    <p>달성 횟수: {goal.current_count}회</p>
                  )}
                  <p>
                    완료일: {new Date(goal.updated_at).toLocaleDateString()}
                  </p>
                  <hr />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 목표가 없을 때 */}
      {goals.length === 0 && (
        <div>
          <h2>아직 목표가 없습니다</h2>
          <p>예산 페이지에서 챌린지를 만들어 목표를 시작해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
