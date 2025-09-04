'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ConfirmationStatus = 'loading' | 'success' | 'error' | 'already_confirmed';

export default function EmailConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        console.log('Magic Link 처리 시작');
        console.log('현재 URL:', window.location.href);
        console.log('URL hash:', window.location.hash);

        // Magic Link는 URL hash에 정보를 담을 수 있음
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const urlParams = new URLSearchParams(window.location.search);

        console.log('Hash 파라미터:', Object.fromEntries(hashParams.entries()));
        console.log('URL 파라미터:', Object.fromEntries(urlParams.entries()));

        // Supabase Auth state change 리스너 등록
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session);

            if (event === 'SIGNED_IN' && session) {
              console.log('Magic Link 로그인 성공!');
              setStatus('success');

              setTimeout(() => {
                router.push('/dashboard');
              }, 3000);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('토큰 갱신됨');
            }
          }
        );

        // 현재 세션 확인
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log('현재 세션:', session);
        console.log('세션 에러:', sessionError);

        if (session) {
          console.log('이미 로그인된 상태');
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          // 세션이 없으면 잠시 더 기다려봄 (Magic Link 처리 시간)
          setTimeout(async () => {
            const {
              data: { session: retrySession },
            } = await supabase.auth.getSession();

            if (retrySession) {
              console.log('재시도 후 세션 확인됨');
              setStatus('success');
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            } else {
              console.log('세션 생성 실패');
              setStatus('error');
              setError('이메일 인증 처리 중 문제가 발생했습니다.');
            }
          }, 2000);
        }

        // cleanup
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Magic Link 처리 중 에러:', err);
        setStatus('error');
        setError('예상치 못한 에러가 발생했습니다.');
      }
    };

    handleMagicLink();
  }, [router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-500 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              이메일 인증 중...
            </h2>
            <p className="text-gray-600">Magic Link를 처리하고 있습니다</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-gray-900">인증 완료!</h2>
            <div className="space-y-3 text-gray-600">
              <p>이메일 인증이 성공적으로 완료되었습니다.</p>
              <p>DaylyLog에 오신 것을 환영합니다!</p>
              <p className="text-sm text-accent-600">
                잠시 후 대시보드로 이동합니다...
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              지금 시작하기
            </Link>
          </div>
        );

      case 'already_confirmed':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">ℹ️</div>
            <h2 className="text-2xl font-bold text-gray-900">이미 인증 완료</h2>
            <div className="space-y-3 text-gray-600">
              <p>이메일이 이미 인증되었습니다.</p>
              <p>바로 로그인하여 DaylyLog를 이용해보세요.</p>
            </div>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                로그인하기
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-gray-900">인증 실패</h2>
            <div className="space-y-3 text-gray-600">
              <p>Magic Link 처리 중 문제가 발생했습니다.</p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">다음을 시도해보세요:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 이메일 링크를 다시 클릭해보세요</li>
                <li>• 브라우저를 새로고침 후 다시 시도</li>
                <li>• 새로운 인증 이메일 요청</li>
              </ul>

              <div className="space-y-2">
                <Link
                  href="/auth/signup"
                  className="inline-block px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  다시 회원가입
                </Link>
                <div>
                  <Link
                    href="/auth/login"
                    className="text-sm text-accent-600 hover:text-accent-500 transition-colors"
                  >
                    로그인 시도하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-accent-700 hover:text-accent-800 transition-colors"
          >
            DaylyLog
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
