import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-accent-800">
            DaylyLog 시작하기
          </h2>
          <p className="mt-2 text-center text-sm text-accent-600">
            새로운 계정을 만들어보세요
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-accent-700"
              >
                이메일 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-accent-700"
              >
                비밀번호 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-accent-700"
              >
                이름 *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-accent-700"
              >
                닉네임 (선택)
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="다른 사용자와 겹치면 안돼요"
              />
              <p className="mt-1 text-xs text-accent-500">
                닉네임은 다른 사용자와 중복될 수 없어요
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              회원가입
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-accent-600 hover:text-accent-500"
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
