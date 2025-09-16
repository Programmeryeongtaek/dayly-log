'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Target,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/auth';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAuthenticated, logout } = useAuth();

  // 외부 클릭 감지하여 사용자 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // preview 페이지에서는 헤더를 렌더링하지 않음
  if (pathname === '/preview' || pathname?.startsWith('/auth/')) {
    return null;
  }

  // 네비게이션 메뉴 항목
  const navigationItems = [
    {
      name: '가계부',
      href: '/budget',
      icon: BarChart3,
      description: '지출 관리',
    },
    {
      name: '목표',
      href: '/goals',
      icon: Target,
      description: '목표 설정',
    },
    {
      name: '질문',
      href: '/questions',
      icon: MessageSquare,
      description: '성찰 질문',
    },
    {
      name: '회고',
      href: '/reflections',
      icon: BookOpen,
      description: '일상 회고',
    },
  ];

  // 현재 경로가 활성 상태인지 확인
  const isActiveRoute = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      logout();
      setIsUserMenuOpen(false);
      // 로그아웃 후 즉시 메인화면으로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 사용자 이름 표시
  const getUserDisplayName = () => {
    if (!user) return '사용자';

    // 프로필에서 우선 조회
    if (profile?.nickname) return profile.nickname;
    if (profile?.name) return profile.name;

    // user_metadata에서 조회
    const nickname = user.user_metadata?.nickname;
    const name = user.user_metadata?.name;
    const email = user.email;

    return nickname || name || email?.split('@')[0] || '사용자';
  };

  return (
    <header className="bg-white shadow-sm border-b border-accent-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8">
        <div className="flex justify-between items-center py-3 mobile:py-4">
          {/* 로고 */}
          <div className="flex items-center">
            <Link
              href={isAuthenticated ? '/dashboard' : '/'}
              className="text-xl mobile:text-2xl font-bold text-accent-700 hover:text-accent-800 transition-colors"
            >
              DaylyLog
            </Link>
          </div>

          {/* 데스크톱 네비게이션 - 로그인된 상태에서만 표시 */}
          {isAuthenticated && (
            <nav className="hidden tablet:flex space-x-2 laptop:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm laptop:text-base
                      ${
                        isActive
                          ? 'bg-accent-100 text-accent-700 font-semibold'
                          : 'text-accent-600 hover:text-accent-800 hover:bg-accent-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 laptop:w-5 laptop:h-5" />
                    <span className="hidden laptop:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* 우측 영역 */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* 사용자 프로필 (데스크톱) */}
                <div
                  className="hidden tablet:flex items-center gap-2 relative"
                  ref={userMenuRef}
                >
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent-50 transition-colors hover:cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden laptop:inline">
                      {getUserDisplayName()}
                    </span>
                  </button>

                  {/* 사용자 드롭다운 메뉴 */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/my"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        마이페이지
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-base text-red-600 hover:bg-red-50 transition-colors w-full text-left hover:cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>

                {/* 모바일 메뉴 버튼 */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="tablet:hidden p-2 text-accent-600 hover:text-accent-800 hover:bg-accent-50 rounded-lg transition-colors hover:cursor-pointer"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              /* 로그인되지 않은 상태 - 로그인/회원가입 버튼 */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-accent-600 hover:text-accent-800 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-accent-600 text-white px-3 py-2 rounded-lg hover:bg-accent-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 모바일 메뉴 - 로그인된 상태에서만 표시 */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="tablet:hidden pb-4 border-t border-accent-100 mt-2">
            <nav className="flex flex-col space-y-1 mt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? 'bg-accent-100 text-accent-700 font-semibold'
                          : 'text-accent-600 hover:text-accent-800 hover:bg-accent-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}

              {/* 모바일 사용자 프로필 */}
              <div className="mt-4 pt-4 border-t border-accent-100">
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-gray-900">
                      {getUserDisplayName()}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <Link
                        href="/my"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-accent-600 hover:text-accent-800"
                      >
                        마이페이지
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-red-600 hover:text-red-800 hover:cursor-pointer"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
