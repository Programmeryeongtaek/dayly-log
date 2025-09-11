'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { LoginFormValues, loginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // 실시간 검증
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error) {
      // 에러는 useAuth에서 처리됨
      console.error('로그인 실패:', error);
    }
  };

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
            <h2 className="mt-6 text-2xl font-bold text-gray-900">로그인</h2>
            <p className="mt-2 text-sm text-gray-600">
              계정에 로그인하여 DaylyLog를 시작하세요.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 hover:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors ${
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
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 hover:border-accent-400 focus:ring-accent-500 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* 전역 에러 표시 */}
            {loginError && (
              <p className="text-sm text-red-600">
                {loginError.message ||
                  '로그인에 실패했습니다. 다시 시도해주세요.'}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn || !isValid}
                className="hover:cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingIn ? '로그인 중...' : '로그인'}
              </button>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <Link
                href="/auth/signup"
                className="text-accent-600 hover:text-accent-500 text-sm font-medium transition-colors"
              >
                계정이 없으신가요? 회원가입
              </Link>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                메인 화면으로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default LoginPage;
