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
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // preview 페이지에서는 헤더를 렌더링하지 않음
  if (pathname === '/preview') {
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

  return (
    <header className="bg-white shadow-sm border-b border-accent-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 mobile:px-4 tablet:px-6 laptop:px-8">
        <div className="flex justify-between items-center py-3 mobile:py-4">
          {/* 로고 */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl mobile:text-2xl font-bold text-accent-700 hover:text-accent-800 transition-colors"
            >
              DaylyLog
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
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

          {/* 우측 사용자 영역 */}
          <div className="flex items-center gap-2">
            {/* 사용자 프로필 (데스크톱) */}
            <div className="hidden tablet:flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden laptop:inline">
                사용자
              </span>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="tablet:hidden p-2 text-accent-600 hover:text-accent-800 hover:bg-accent-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
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
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">사용자</span>
                    <button className="text-xs text-accent-600 hover:text-accent-800 text-left">
                      로그아웃
                    </button>
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
