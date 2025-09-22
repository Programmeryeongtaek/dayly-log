import {
  LoginFormData,
  ProfileUpdateData,
  SignupFormData,
} from "./../../types/auth/forms";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // 현재 세션 조회
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setIsInitialized(true);
      return session;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });

  // 사용자 프로필 조회
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["auth", "profile", session?.user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      // 프로필이 없으면 자동 생성
      if (!data && !error) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || 'Unknown User',
            nickname: session.user.user_metadata?.nickname || null,
          }])
          .select()
          .single();

        if (!createError) {
          // 기본 카테고리 생성
          await supabase.from('categories').insert([{
            user_id: session.user.id,
            name: '통신비',
            type: 'expense_fixed',
            is_default: true,
          }]). select();

          return newProfile;
        } else {
          console.error('프로필 생성 실패:', createError);
        }
      }

      if (error) {
        console.error("프로필 조회 에러:", error);
        throw error;
      }

      // 프로필이 없어도 에러로 처리하지 않음
      return data || null;
    },
    enabled: !!session?.user?.id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false, // 재시도 완전 비활성화로 무한 루프 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // 로그인
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // 로그인 실패 에러 메시지
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("Email not confirmed") ||
          error.message.includes("Invalid email or password")
        ) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 회원가입
  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name, nickname }: SignupFormData) => {
      // 회원가입만 진행 (Supabase가 이메일 중복을 처리함)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, nickname: nickname?.trim() || null },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already been registered")
        ) {
          throw new Error("이미 가입된 이메일입니다.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // 1단계: Supabase 로그아웃
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn("Supabase 로그아웃 오류:", error);
        }

        // 2단계: access_token 강제 제거
        if (typeof window !== "undefined") {
          // 현재 Supabase 프로젝트의 정확한 storage key 찾기
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const projectRef = supabaseUrl.split("//")[1].split(".")[0];
          const storageKey = `sb-${projectRef}-auth-token`;

          // access_token이 포함된 키들 정리
          const keysToRemove = [
            storageKey,
            "supabase.auth.token",
            "sb-auth-token",
            `sb-${projectRef}-auth-token`,
            "daylylog-auth-token",
          ];

          keysToRemove.forEach((key) => {
            try {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            } catch (e) {
              console.warn(`토큰 키 제거 실패: ${key}`, e);
            }
          });

          // localStorage에서 access_token이 포함된 모든 키 검색 및 제거
          const allKeys = Object.keys(localStorage);
          allKeys.forEach((key) => {
            try {
              const value = localStorage.getItem(key);
              if (
                value &&
                (value.includes("access_token") ||
                  value.includes("refresh_token") ||
                  key.includes("supabase") ||
                  key.includes("sb-"))
              ) {
                localStorage.removeItem(key);
              }
            } catch (e) {
              // 파싱 오류 무시
            }
          });

          // 세션 스토리지도 동일하게 처리
          const sessionKeys = Object.keys(sessionStorage);
          sessionKeys.forEach((key) => {
            try {
              const value = sessionStorage.getItem(key);
              if (
                value &&
                (value.includes("access_token") ||
                  value.includes("refresh_token") ||
                  key.includes("supabase") ||
                  key.includes("sb-"))
              ) {
                sessionStorage.removeItem(key);
              }
            } catch (e) {
              // 파싱 오류 무시
            }
          });
        }
      } catch (error) {
        console.error("로그아웃 처리 중 오류:", error);
        // 오류 발생 시에도 강제 정리
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onSettled: () => {
      // 성공/실패 관계없이 페이지 새로고침으로 완전 초기화
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
    },
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: ProfileUpdateData) => {
      if (!session?.user?.id) throw new Error("인증이 필요합니다.");

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!email?.trim()) return { available: true };

      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email.trim())
        .single();

      // 데이터가 있으면 중복, 없으면 사용 가능
      return { available: !data };
    },
  });

  const checkNicknameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      if (!nickname?.trim()) return { available: true };

      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("nickname", nickname.trim())
        .single();

      // 데이터가 있으면 중복, 없으면 사용 가능
      return { available: !data };
    },
  });

  // 닉네임 체크 결과 초기화 함수
  const resetNicknameCheck = () => {
    queryClient.setQueryData(["nickname-check"], null);
    checkNicknameMutation.reset();
  };

  // 세션 변경 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        // 로그인 시 프로필 쿼리만 갱신
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      } else if (event === "SIGNED_OUT") {
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return {
    // 상태
    user: session?.user || null,
    profile,
    session,
    isLoading: isSessionLoading || (!isInitialized && session === undefined),
    isAuthenticated: !!session?.user,
    emailCheckResult: checkEmailMutation.data,
    nicknameCheckResult: checkNicknameMutation.data,
    resetNicknameCheck,

    // 액션
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    checkEmail: checkEmailMutation.mutate,
    checkNickname: checkNicknameMutation.mutate,

    // 로딩 상태
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isCheckingEmail: checkEmailMutation.isPending,
    isCheckingNickname: checkNicknameMutation.isPending,

    // 에러
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
    emailCheckError: checkEmailMutation.error,
    nicknameCheckError: checkNicknameMutation.error,
  };
};
