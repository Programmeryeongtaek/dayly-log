"use client";

import { useAuth } from "@/hooks/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // 인증이 필요한데 로그인하지 않은 경우
        router.push(
          redirectTo || `/auth/login?redirect=${encodeURIComponent(pathname)}`,
        );
      } else if (!requireAuth && isAuthenticated) {
        // 인증이 불필요한데 로그인한 경우 (로그인/회원가입 페이지)
        router.push(redirectTo || "/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-accent-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증 상태 확인 후 조건에 맞지 않으면 빈 화면
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
