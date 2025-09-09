'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { SignupFormValues, signupSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignupPage() {
  const {
    signup,
    isSigningUp,
    signupError,
    checkNickname,
    isCheckingNickname,
    nicknameCheckResult,
    resetNicknameCheck,
    checkEmail,
    emailCheckResult,
  } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // 실시간 검증
  });

  // 닉네임 입력값이 변경되면 중복 체크 결과 초기화
  useEffect(() => {
    const subscription = watch(({ name }) => {
      if (name === 'nickname') {
        resetNicknameCheck();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, resetNicknameCheck]);

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
              이메일을 확인해주세요.
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
                <li>1. 이메일 받은편지함을 확인하세요.</li>
                <li>2. 스팸 폴더도 확인해보세요.</li>
                <li>3. 인증 링크를 클릭하세요.</li>
                <li>4. 로그인 페이지로 돌아와서 로그인하세요.</li>
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
              새로운 계정을 만들어 DaylyLog를 시작해보세요.
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
                  이메일 <strong className="text-red-500">*</strong>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  onBlur={() => {
                    const email = watch('email');
                    if (email?.trim() && !errors.email) {
                      checkEmail(email.trim());
                    }
                  }}
                  className={`mt-1 block w-full px-3 py-2 border-2 rounded-lg hover:border-accent-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                    errors.email ||
                    (emailCheckResult && !emailCheckResult.available)
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-accent-500'
                  }`}
                  placeholder="example@email.com"
                />

                {/* 이메일 유효성 검사 에러 */}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}

                {/* 이메일 중복 체크 결과 */}
                {emailCheckResult &&
                  watch('email')?.trim() &&
                  !errors.email && (
                    <p
                      className={`mt-1 text-sm ${
                        emailCheckResult.available
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {emailCheckResult.available
                        ? '사용 가능한 이메일입니다.'
                        : '이미 가입된 이메일입니다.'}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호 <strong className="text-red-500">*</strong>
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`mt-1 block w-full px-3 py-2 border-2 rounded-lg hover:border-accent-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors ${
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
                  이름 <strong className="text-red-500">*</strong>
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className={`mt-1 block w-full px-3 py-2 border-2 rounded-lg hover:border-accent-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors ${
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
                <div className="flex gap-2">
                  <input
                    id="nickname"
                    type="text"
                    {...register('nickname')}
                    className={`mt-1 block w-2/3 px-3 py-2 border-2 rounded-lg hover:border-accent-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-500 transition-colors ${
                      errors.nickname
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-accent-500'
                    }`}
                    placeholder="닉네임 입력"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nickname = watch('nickname');
                      if (nickname?.trim()) {
                        checkNickname(nickname.trim());
                      }
                    }}
                    disabled={isCheckingNickname || !watch('nickname')?.trim()}
                    className="mt-1 px-3 py-2 w-1/3 hover:cursor-pointer bg-accent-200 text-black hover:bg-accent-300 text-sm hover:font-bold rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isCheckingNickname ? '확인중...' : '중복확인'}
                  </button>
                </div>

                {/* 닉네임 체크 결과 표시 */}
                {nicknameCheckResult && watch('nickname')?.trim() ? (
                  <p
                    className={`mt-1 text-sm ${
                      nicknameCheckResult.available
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {nicknameCheckResult.available
                      ? '사용 가능한 닉네임입니다.'
                      : '이미 사용 중인 닉네임입니다.'}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    닉네임은 나중에도 변경할 수 있습니다.
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isSigningUp ||
                  !isValid ||
                  (emailCheckResult && !emailCheckResult.available) ||
                  (nicknameCheckResult && !nicknameCheckResult.available)
                }
                className="hover:cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
