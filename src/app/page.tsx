import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Target,
  MessageSquare,
  BookOpen,
  Users,
  Star,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-accent-50 via-accent-50 to-accent-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600/10 to-accent-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8 py-16 mobile:py-20 tablet:py-24">
          <div className="text-center space-y-6 mobile:space-y-8">
            {/* 로고 & 타이틀 */}
            <div className="space-y-3 mobile:space-y-4">
              <div className="inline-flex items-center px-3 mobile:px-4 py-1.5 mobile:py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-xs mobile:text-sm font-medium text-accent-700">
                  💎 개인 성장의 새로운 시작
                </span>
              </div>
              <h1 className="text-4xl mobile:text-5xl tablet:text-6xl laptop:text-7xl xl:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-500">
                DaylyLog
              </h1>
              <p className="text-base mobile:text-lg tablet:text-xl laptop:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2 mobile:px-0">
                매일의 기록이 만드는{' '}
                <span className="font-semibold text-accent-600">
                  특별한 변화
                </span>
                <br />
                일상을 기록하고, 목표를 달성하며, 성장을 추적하는 스마트한 방법
              </p>
            </div>

            {/* CTA 버튼 */}
            <div className="flex flex-col mobile:flex-row gap-3 mobile:gap-4 justify-center items-center px-4 mobile:px-0">
              <Link
                href="/auth/signup"
                className="group relative px-6 mobile:px-8 py-3 mobile:py-4 bg-gradient-to-r from-accent-600 to-accent-500 text-white text-base mobile:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full mobile:w-auto text-center"
              >
                지금 시작하기
                <ArrowRight className="inline-block ml-2 w-4 h-4 mobile:w-5 mobile:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="px-6 mobile:px-8 py-3 mobile:py-4 bg-white/80 backdrop-blur-sm text-accent-600 text-base mobile:text-lg font-semibold border-2 border-accent-200 rounded-xl hover:bg-white hover:border-accent-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 w-full mobile:w-auto text-center"
              >
                로그인
              </Link>
            </div>

            {/* 통계 */}
            <div className="pt-8 mobile:pt-12 grid grid-cols-3 gap-4 mobile:gap-8 max-w-xs mobile:max-w-md mx-auto">
              <div className="text-center">
                <div className="text-lg mobile:text-2xl font-bold text-accent-600">
                  1,000+
                </div>
                <div className="text-xs mobile:text-sm text-gray-600">
                  활성 사용자
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg mobile:text-2xl font-bold text-accent-500">
                  50,000+
                </div>
                <div className="text-xs mobile:text-sm text-gray-600">
                  기록된 목표
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg mobile:text-2xl font-bold text-accent-400">
                  98%
                </div>
                <div className="text-xs mobile:text-sm text-gray-600">
                  만족도
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="py-16 mobile:py-20 tablet:py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8">
          <div className="text-center mb-12 mobile:mb-16">
            <h2 className="text-2xl mobile:text-3xl tablet:text-4xl font-bold text-gray-900 mb-3 mobile:mb-4">
              모든 기능이 하나로
            </h2>
            <p className="text-base mobile:text-lg tablet:text-xl text-gray-600 max-w-2xl mx-auto px-4 mobile:px-0">
              복잡한 도구는 그만, 직관적이고 강력한 기능으로 당신의 성장을
              도와드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6 mobile:gap-8">
            {/* 가계부 */}
            <div className="group relative bg-gradient-to-br from-accent-50 to-accent-100 p-6 mobile:p-8 rounded-2xl border border-accent-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 mobile:w-12 mobile:h-12 bg-accent-500 rounded-xl flex items-center justify-center mb-3 mobile:mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 mobile:w-6 mobile:h-6 text-white" />
                </div>
                <h3 className="text-lg mobile:text-xl font-bold text-gray-900 mb-2 mobile:mb-3">
                  스마트 가계부
                </h3>
                <p className="text-sm mobile:text-base text-gray-600 leading-relaxed">
                  지출을 카테고리별로 분류하고 아름다운 차트로 한눈에
                  확인하세요. 월간/연간 통계로 소비 패턴을 분석할 수 있어요.
                </p>
                <div className="mt-3 mobile:mt-4 text-xs mobile:text-sm text-accent-600 font-medium">
                  • 실시간 통계 • 카테고리 분석 • 예산 관리
                </div>
              </div>
            </div>

            {/* 목표 설정 */}
            <div className="group relative bg-gradient-to-br from-accent-100 to-accent-200 p-6 mobile:p-8 rounded-2xl border border-accent-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 mobile:w-12 mobile:h-12 bg-accent-400 rounded-xl flex items-center justify-center mb-3 mobile:mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 mobile:w-6 mobile:h-6 text-white" />
                </div>
                <h3 className="text-lg mobile:text-xl font-bold text-gray-900 mb-2 mobile:mb-3">
                  목표 달성
                </h3>
                <p className="text-sm mobile:text-base text-gray-600 leading-relaxed">
                  시간, 에너지, 돈을 기반으로 구체적인 목표를 설정하고 진행률을
                  추적하세요. 작은 성취도 놓치지 않고 기록할 수 있어요.
                </p>
                <div className="mt-3 mobile:mt-4 text-xs mobile:text-sm text-accent-500 font-medium">
                  • 진행률 추적 • 달성 알림 • 목표 분석
                </div>
              </div>
            </div>

            {/* 질문 모음 (accent로 통일) */}
            <div className="group relative bg-gradient-to-br from-accent-50 to-accent-100 p-6 mobile:p-8 rounded-2xl border border-accent-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 mobile:w-12 mobile:h-12 bg-accent-400 rounded-xl flex items-center justify-center mb-3 mobile:mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 mobile:w-6 mobile:h-6 text-white" />
                </div>
                <h3 className="text-lg mobile:text-xl font-bold text-gray-900 mb-2 mobile:mb-3">
                  성찰 질문
                </h3>
                <p className="text-sm mobile:text-base text-gray-600 leading-relaxed">
                  매주 제공되는 의미있는 질문들로 자신을 돌아보세요. 이웃들과
                  생각을 나누며 함께 성장할 수 있어요.
                </p>
                <div className="mt-3 mobile:mt-4 text-xs mobile:text-sm text-accent-600 font-medium">
                  • 주간 질문 • 소셜 기능 • 성찰 기록
                </div>
              </div>
            </div>

            {/* 회고 (accent로 통일) */}
            <div className="group relative bg-gradient-to-br from-accent-50 to-accent-100 p-6 mobile:p-8 rounded-2xl border border-accent-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="w-10 h-10 mobile:w-12 mobile:h-12 bg-accent-500 rounded-xl flex items-center justify-center mb-3 mobile:mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 mobile:w-6 mobile:h-6 text-white" />
                </div>
                <h3 className="text-lg mobile:text-xl font-bold text-gray-900 mb-2 mobile:mb-3">
                  일상 회고
                </h3>
                <p className="text-sm mobile:text-base text-gray-600 leading-relaxed">
                  감사한 순간, 기억할 순간, 개선할 점을 기록하세요. 키워드
                  검색으로 과거의 기록을 쉽게 찾을 수 있어요.
                </p>
                <div className="mt-3 mobile:mt-4 text-xs mobile:text-sm text-accent-600 font-medium">
                  • 키워드 검색 • 월간 모아보기 • 감정 분석
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 소셜 기능 하이라이트 */}
      <section className="py-16 mobile:py-20 tablet:py-24 bg-gradient-to-r from-accent-600 to-accent-500">
        <div className="max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8">
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8 mobile:gap-12 items-center">
            <div className="text-white space-y-4 mobile:space-y-6">
              <div className="inline-flex items-center px-3 mobile:px-4 py-1.5 mobile:py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Users className="w-3 h-3 mobile:w-4 mobile:h-4 mr-2" />
                <span className="text-xs mobile:text-sm font-medium">
                  함께 성장하는 커뮤니티
                </span>
              </div>
              <h2 className="text-2xl mobile:text-3xl tablet:text-4xl font-bold">
                혼자가 아닌
                <br />
                <span className="text-accent-200">함께하는 성장</span>
              </h2>
              <p className="text-base mobile:text-lg tablet:text-xl text-accent-100 leading-relaxed">
                이웃과 연결되어 서로의 성장을 응원하고, 질문에 답하며, 경험을
                나누세요. 진정한 변화는 공감에서 시작됩니다.
              </p>
              <div className="space-y-2 mobile:space-y-3">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mobile:w-2 mobile:h-2 bg-accent-300 rounded-full mr-2 mobile:mr-3"></div>
                  <span className="text-sm mobile:text-base text-accent-100">
                    이웃 신청 및 승인 시스템
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mobile:w-2 mobile:h-2 bg-accent-300 rounded-full mr-2 mobile:mr-3"></div>
                  <span className="text-sm mobile:text-base text-accent-100">
                    실시간 알림 및 활동 피드
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 mobile:w-2 mobile:h-2 bg-accent-300 rounded-full mr-2 mobile:mr-3"></div>
                  <span className="text-sm mobile:text-base text-accent-100">
                    댓글과 좋아요로 소통
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mobile:p-8 border border-white/20">
                <div className="space-y-3 mobile:space-y-4">
                  <div className="flex items-center space-x-2 mobile:space-x-3">
                    <div className="w-6 h-6 mobile:w-8 mobile:h-8 bg-gradient-to-r from-accent-400 to-accent-300 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-sm mobile:text-base text-white font-medium">
                        민지님이 목표를 달성했어요! 🎉
                      </div>
                      <div className="text-xs mobile:text-sm text-accent-200">
                        독서 목표 100% 완료
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mobile:space-x-3">
                    <div className="w-6 h-6 mobile:w-8 mobile:h-8 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-sm mobile:text-base text-white font-medium">
                        수현님이 질문에 답변했어요
                      </div>
                      <div className="text-xs mobile:text-sm text-accent-200">
                        가장 감사한 순간은...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mobile:space-x-3">
                    <div className="w-6 h-6 mobile:w-8 mobile:h-8 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-sm mobile:text-base text-white font-medium">
                        지훈님이 회고를 작성했어요
                      </div>
                      <div className="text-xs mobile:text-sm text-accent-200">
                        오늘의 소중한 경험
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 후기 */}
      <section className="py-16 mobile:py-20 tablet:py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8">
          <div className="text-center mb-12 mobile:mb-16">
            <h2 className="text-2xl mobile:text-3xl tablet:text-4xl font-bold text-gray-900 mb-3 mobile:mb-4">
              실제 사용자들의 이야기
            </h2>
            <p className="text-base mobile:text-lg tablet:text-xl text-gray-600">
              DaylyLog와 함께 변화를 경험한 분들의 솔직한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 mobile:gap-8">
            <div className="bg-white p-6 mobile:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-3 mobile:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 mobile:w-5 mobile:h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm mobile:text-base text-gray-700 mb-4 mobile:mb-6 leading-relaxed">
                가계부 기능이 정말 직관적이에요. 복잡한 설정 없이도 지출 패턴을
                한눈에 볼 수 있어서 돈 관리가 훨씬 쉬워졌어요!
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 mobile:w-10 mobile:h-10 bg-gradient-to-r from-accent-400 to-accent-300 rounded-full flex-shrink-0"></div>
                <div className="ml-2 mobile:ml-3 min-w-0">
                  <div className="text-sm mobile:text-base font-semibold text-gray-900">
                    김선영님
                  </div>
                  <div className="text-xs mobile:text-sm text-gray-500">
                    프리랜서 디자이너
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 mobile:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-3 mobile:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 mobile:w-5 mobile:h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm mobile:text-base text-gray-700 mb-4 mobile:mb-6 leading-relaxed">
                매주 나오는 질문들이 정말 의미있어요. 바쁜 일상 속에서도 잠시
                멈춰서 생각할 시간을 가질 수 있게 해줘요.
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 mobile:w-10 mobile:h-10 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                <div className="ml-2 mobile:ml-3 min-w-0">
                  <div className="text-sm mobile:text-base font-semibold text-gray-900">
                    이민호님
                  </div>
                  <div className="text-xs mobile:text-sm text-gray-500">
                    스타트업 개발자
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 mobile:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-3 mobile:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 mobile:w-5 mobile:h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm mobile:text-base text-gray-700 mb-4 mobile:mb-6 leading-relaxed">
                목표 달성 기능 덕분에 작심삼일이 아닌 진짜 변화를 만들어가고
                있어요. 이웃들의 응원도 큰 힘이 되고요!
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 mobile:w-10 mobile:h-10 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                <div className="ml-2 mobile:ml-3 min-w-0">
                  <div className="text-sm mobile:text-base font-semibold text-gray-900">
                    박수진님
                  </div>
                  <div className="text-xs mobile:text-sm text-gray-500">
                    마케팅 매니저
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 마지막 CTA */}
      <section className="py-16 mobile:py-20 tablet:py-24 bg-gradient-to-br from-accent-900 to-accent-800">
        <div className="max-w-4xl mx-auto text-center px-3 mobile:px-4 tablet:px-6 laptop:px-8">
          <h2 className="text-2xl mobile:text-3xl tablet:text-4xl laptop:text-5xl font-bold text-white mb-4 mobile:mb-6">
            변화는{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
              오늘
            </span>
            부터 시작됩니다
          </h2>
          <p className="text-base mobile:text-lg tablet:text-xl text-gray-300 mb-6 mobile:mb-8 leading-relaxed">
            작은 기록이 만드는 큰 변화를 경험해보세요.
            <br />
            당신의 성장 여정이 지금 시작됩니다.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 mobile:px-10 py-3 mobile:py-4 bg-gradient-to-r from-accent-500 to-accent-400 text-white text-lg mobile:text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-accent-500/25 hover:-translate-y-1 transition-all duration-300"
          >
            무료로 시작하기
            <ArrowRight className="ml-2 mobile:ml-3 w-5 h-5 mobile:w-6 mobile:h-6" />
          </Link>
          <p className="text-xs mobile:text-sm text-gray-400 mt-3 mobile:mt-4">
            신용카드 없이 바로 시작 • 언제든 무료로 사용
          </p>
        </div>
      </section>
    </main>
  );
}
