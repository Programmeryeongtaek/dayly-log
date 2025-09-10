import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Target,
  MessageSquare,
  BookOpen,
  Users,
  Star,
  Calendar,
  TrendingUp,
  CheckCircle,
  Wallet,
  Hash,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600/5 to-accent-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            {/* 로고 & 타이틀 */}
            <div className="space-y-6">
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r min-h-[70px] from-accent-600 to-accent-500">
                DaylyLog
              </h1>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                매일의 기록이 만드는{" "}
                <span className="font-bold text-accent-600">특별한 변화</span>
                <br />
                <span className="text-wrap">
                  일상을 기록하고, 목표를 달성하며, 성장을 추적하는 스마트한
                  방법
                </span>
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-600/10 to-accent-500/10 backdrop-blur-sm rounded-full border border-accent-200/50">
                <Sparkles className="w-4 h-4 text-accent-600 mr-2" />
                <span className="text-sm font-medium text-accent-700">
                  개인 성장의 새로운 시작
                </span>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                href="/auth/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-500 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 w-full sm:w-auto"
              >
                시작하기
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/preview"
                className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-accent-600 text-lg font-semibold border-2 border-accent-200 rounded-2xl hover:bg-white hover:border-accent-300 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 w-full sm:w-auto"
              >
                <PlayCircle className="inline-block mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                미리보기
              </Link>
            </div>

            {/* 실제 사용 데이터 미리보기 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 가계부 미리보기 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-accent-500 rounded-lg">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    가계부
                  </span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">이번 달 수입</span>
                      <span className="font-semibold text-green-600">
                        +3,200,000원
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">이번 달 지출</span>
                      <span className="font-semibold text-red-600">
                        -2,450,000원
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                    <div className="text-center text-lg font-bold text-green-600">
                      +750,000원
                    </div>
                  </div>
                </div>
              </div>

              {/* 목표 미리보기 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    목표 관리
                  </span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      카페 지출 줄이기
                    </span>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>거의 달성!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 질문 미리보기 */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    성찰 질문
                  </span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">답변 현황</span>
                    <span className="font-semibold">9/12</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        #성장
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        #감사
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="pt-8 grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">1,000+</div>
                <div className="text-sm text-gray-600">활성 사용자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">
                  50,000+
                </div>
                <div className="text-sm text-gray-600">달성된 목표</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-400">98%</div>
                <div className="text-sm text-gray-600">사용자 만족도</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              모든 기능이 하나로
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 도구는 그만, 직관적이고 강력한 기능으로 당신의 성장을
              도와드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 가계부 */}
            <div className="group relative bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-3xl border border-accent-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      스마트 가계부
                    </h3>
                    <p className="text-accent-600 text-sm font-medium">
                      실시간 자동 분석
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  지출을 카테고리별로 분류하고 아름다운 차트로 한눈에
                  확인하세요. 월간/연간 통계로 소비 패턴을 분석할 수 있어요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-accent-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>실시간 통계 분석</span>
                  </div>
                  <div className="flex items-center text-sm text-accent-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>카테고리별 지출 분석</span>
                  </div>
                  <div className="flex items-center text-sm text-accent-600">
                    <Target className="w-4 h-4 mr-2" />
                    <span>예산 설정 & 알림</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 목표 설정 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl border border-green-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      목표 달성
                    </h3>
                    <p className="text-green-600 text-sm font-medium">
                      체계적인 성취 관리
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  시간, 에너지, 돈을 기반으로 구체적인 목표를 설정하고 진행률을
                  추적하세요. 작은 성취도 놓치지 않고 기록할 수 있어요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>진행률 실시간 추적</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>달성 알림 & 리마인더</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>목표 성취 패턴 분석</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 질문 모음 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      성찰 질문
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">
                      깊은 자기 탐구
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  매주 제공되는 의미있는 질문들로 자신을 돌아보세요. 이웃들과
                  생각을 나누며 함께 성장할 수 있어요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>매주 새로운 성찰 질문</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>이웃과 함께하는 답변</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <span>키워드로 정리된 기록</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 회고 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border border-purple-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      일상 회고
                    </h3>
                    <p className="text-purple-600 text-sm font-medium">
                      감사와 성장의 기록
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  감사한 순간, 기억할 순간, 개선할 점을 기록하세요. 키워드
                  검색으로 과거의 기록을 쉽게 찾을 수 있어요.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <span>키워드 기반 검색</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>월간 회고 모아보기</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>감정 패턴 분석</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 소셜 기능 하이라이트 */}
      <section className="py-20 bg-gradient-to-r from-accent-600 to-accent-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  함께 성장하는 커뮤니티
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">
                혼자, 그리고
                <br />
                <span className="text-accent-200">함께하는 성장</span>
              </h2>
              <p className="text-xl text-accent-100 leading-relaxed">
                서로의 성장을 응원하고, 질문에 답하며, 경험을 나누세요. 진정한
                변화는 공감에서 시작됩니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent-300 rounded-full mr-4"></div>
                  <span className="text-accent-100">
                    이웃 신청 및 승인 시스템
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent-300 rounded-full mr-4"></div>
                  <span className="text-accent-100">
                    실시간 알림 및 활동 피드
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent-300 rounded-full mr-4"></div>
                  <span className="text-accent-100">댓글과 좋아요로 소통</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-300 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold">
                        민지님이 목표를 달성했어요!
                      </div>
                      <div className="text-accent-200 text-sm">
                        독서 목표 100% 완료
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold">
                        수현님이 질문에 답변했어요
                      </div>
                      <div className="text-accent-200 text-sm">
                        가장 감사한 순간은...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold">
                        지훈님이 회고를 작성했어요
                      </div>
                      <div className="text-accent-200 text-sm">
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
      <section className="py-20 bg-white/70">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              사용자들의 이야기
            </h2>
            <p className="text-xl text-gray-600">
              DaylyLog를 경험한 분들의 솔직한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                가계부 기능이 정말 직관적이에요. 복잡한 설정 없이도 지출 패턴을
                한눈에 볼 수 있어서 돈 관리가 훨씬 쉬워졌어요!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-300 rounded-full flex-shrink-0"></div>
                <div className="ml-4 min-w-0">
                  <div className="font-semibold text-gray-900">김선영님</div>
                  <div className="text-sm text-gray-500">프리랜서 디자이너</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                매주 나오는 질문들이 정말 의미있어요. 바쁜 일상 속에서도 잠시
                멈춰서 생각할 시간을 가질 수 있게 해줘요.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                <div className="ml-4 min-w-0">
                  <div className="font-semibold text-gray-900">이민호님</div>
                  <div className="text-sm text-gray-500">스타트업 개발자</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                목표 달성 기능 덕분에 작심삼일이 아닌 진짜 변화를 만들어가고
                있어요. 이웃들의 응원도 큰 힘이 되고요!
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-300 to-accent-400 rounded-full flex-shrink-0"></div>
                <div className="ml-4 min-w-0">
                  <div className="font-semibold text-gray-900">박수진님</div>
                  <div className="text-sm text-gray-500">마케팅 매니저</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 마지막 CTA */}
      <section className="py-20 bg-gradient-to-br from-accent-900 to-accent-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold text-white mb-6">
            변화는{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
              오늘
            </span>
            부터!
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            작은 기록이 만드는 큰 변화를 경험해보세요.
            <br />
            당신의 성장 여정이 지금 시작됩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-400 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-accent-500/25 hover:-translate-y-2 transition-all duration-300"
            >
              시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/preview"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-2xl border border-white/30 hover:bg-white/30 hover:-translate-y-2 transition-all duration-300"
            >
              <PlayCircle className="mr-2 w-5 h-5" />
              미리보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
