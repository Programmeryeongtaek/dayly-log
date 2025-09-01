'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { SignupFormValues, signupSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isSigningUp, signupError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // 실시간 검증
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup({
        ...data,
        nickname: data.nickname?.trim() || undefined,
      });

      setUserEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      console.error('회원가입 상세 에러:', error);
    }
  };

  // 이메일 인증 대기 화면
  if (isSuccess) {
    return (
      <AuthGuard requireAuth={false}>
        <div className="min-h-screen flex items-center justify-center bg-accent-50">
          <div className="max-w-md w-full text-center space-y-6 p-6">
            <div className="text-6xl">📧</div>
            <h2 className="text-2xl font-bold text-gray-900">
              이메일을 확인해주세요
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>{userEmail}</strong>로<br />
                인증 이메일을 발송했습니다.
              </p>
              <p className="text-sm">
                이메일의 링크를 클릭하여 계정을 활성화한 후<br />
                로그인할 수 있습니다.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">다음 단계:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. 이메일 받은편지함을 확인하세요</li>
                <li>2. 스팸 폴더도 확인해보세요</li>
                <li>3. 인증 링크를 클릭하세요</li>
                <li>4. 로그인 페이지로 돌아와서 로그인하세요</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                로그인 페이지로 가기
              </Link>

              <div>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setUserEmail('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  다른 이메일로 다시 시도
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-accent-50">
        <div className="max-w-md w-full space-y-8 p-6">
          <div className="text-center">
            <Link
              href="/"
              className="text-3xl font-bold text-accent-700 hover:text-accent-800 transition-colors"
            >
              DaylyLog
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">회원가입</h2>
            <p className="mt-2 text-sm text-gray-600">
              새로운 계정을 만들어 DaylyLog를 시작해보세요
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {signupError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">
                  {signupError.message ||
                    '회원가입에 실패했습니다. 다시 시도해주세요.'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일 *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호 *
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="6자 이상 입력"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  이름 *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700"
                >
                  닉네임 (선택)
                </label>
                <input
                  id="nickname"
                  type="text"
                  {...register('nickname')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                    errors.nickname
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="다른 사용자에게 표시될 이름"
                />
                {errors.nickname && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nickname.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  닉네임은 나중에 변경할 수 있습니다
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSigningUp || !isValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSigningUp ? '가입 중...' : '회원가입'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-accent-600 hover:text-accent-500 text-sm font-medium transition-colors"
              >
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
