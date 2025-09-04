import { LoginFormData, ProfileUpdateData, SignupFormData } from './../../types/auth/forms';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // 현재 세션 조회
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
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
    queryKey: ['auth', 'profile', session?.user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('프로필 조회 에러:', error);
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  // 회원가입
  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name, nickname }: SignupFormData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            nickname: nickname || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 회원가입 후 즉시 세션 갱신
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: async() => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: ProfileUpdateData) => {
      if (!session?.user?.id) throw new Error('인증이 필요합니다.');

      const { data, error} = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });

  // 세션 변경 감지
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // 로그인 시 프로필 쿼리만 갱신
          queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
        } else if (event === 'SIGNED_OUT') {
          queryClient.clear();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return {
    // 상태
    user: session?.user || null,
    profile,
    session,
    isLoading: (isSessionLoading || isProfileLoading) && !isInitialized,
    isAuthenticated: !!session?.user,
    
    // 액션
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    
    // 로딩 상태
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    // 에러
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
};