import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-accent-800">
            DaylyLog에 로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-accent-700"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-accent-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-accent-200 text-accent-900 placeholder-accent-400 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              로그인
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-accent-600 hover:text-accent-500"
            >
              계정이 없으신가요? 회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
