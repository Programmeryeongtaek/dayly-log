import { supabase } from "@/lib/supabase";
import {
  DomainStats,
  DomainType,
  NeighborInfo,
  NeighborPost,
} from "@/types/my";
import { useCallback, useEffect, useState } from "react";

interface NeighborDetailData {
  profile: NeighborInfo;
  domainStats: DomainStats;
  posts: {
    gratitude: NeighborPost[];
    reflection: NeighborPost[];
    daily: NeighborPost[];
    growth: NeighborPost[];
    custom: NeighborPost[];
  };
}

// 타입 가드 함수들
const isValidCategory = (
  category: unknown,
): category is { name: string; display_name: string } => {
  if (!category || typeof category !== "object") return false;

  const cat = category as Record<string, unknown>;
  return typeof cat.name === "string" && typeof cat.display_name === "string";
};

export const useNeighborDetailProfile = (neighborId: string) => {
  const [data, setData] = useState<NeighborDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainType>("gratitude");

  const fetchNeighborProfile = useCallback(async () => {
    if (!neighborId) return;

    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("인증이 필요합니다.");

      // 이웃 관계 확인
      const { data: neighborRelation, error: relationError } = await supabase
        .from("neighbor_relationships")
        .select("*")
        .or(
          `and(requester_id.eq.${user.id},recipient_id.eq.${neighborId},status.eq.accepted),and(requester_id.eq.${neighborId},recipient_id.eq.${user.id},status.eq.accepted)`,
        )
        .single();

      if (relationError || !neighborRelation) {
        throw new Error("이웃 관계를 찾을 수 없습니다.");
      }

      // 프로필 기본 정보 조회
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, nickname, created_at, updated_at")
        .eq("id", neighborId)
        .single();

      if (profileError || !profileData) {
        throw new Error("프로필 정보를 불러올 수 없습니다.");
      }

      // 병렬로 데이터 조회
      const [reflectionsResult, questionsResult] = await Promise.all([
        supabase
          .from("reflections")
          .select(
            `
          id, 
          title, 
          content, 
          date, 
          created_at,
          updated_at,
          category_id,
          reflection_categories!inner (
            name,
            display_name
          )
        `,
          )
          .eq("user_id", neighborId)
          .or("is_public.eq.true,is_neighbor_visible.eq.true")
          .order("date", { ascending: false }),

        supabase
          .from("questions")
          .select(
            `
          id, 
          title, 
          content, 
          answer, 
          date, 
          is_answered, 
          created_at,
          updated_at,
          category_id,
          question_categories!inner (
            name,
            display_name
          )
        `,
          )
          .eq("user_id", neighborId)
          .or("is_public.eq.true,is_neighbor_visible.eq.true")
          .order("date", { ascending: false }),
      ]);

      // 에러 처리 개선
      if (reflectionsResult.error) {
        console.error("Reflections fetch error:", reflectionsResult.error);
      }
      if (questionsResult.error) {
        console.error("Questions fetch error:", questionsResult.error);
      }

      // 통계 초기화
      const domainStats: DomainStats = {
        gratitude: 0,
        reflection: 0,
        daily: 0,
        growth: 0,
        custom: 0,
      };

      // 카테고리별 게시물 배열 초기화
      const categorizedPosts = {
        gratitude: [] as NeighborPost[],
        reflection: [] as NeighborPost[],
        daily: [] as NeighborPost[],
        growth: [] as NeighborPost[],
        custom: [] as NeighborPost[],
      };

      // 회고 데이터 처리 개선
      const reflectionsData = reflectionsResult.data || [];
      reflectionsData.forEach((item) => {
        const category = item.reflection_categories;
        if (!isValidCategory(category)) return;

        const categoryName = category.name as "gratitude" | "reflection";

        // 통계 증가
        domainStats[categoryName]++;

        // 게시물 생성
        const post: NeighborPost = {
          id: item.id,
          type: "reflection",
          title: item.title || "",
          content: item.content,
          date: item.date,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category_id: item.category_id,
          category_name: categoryName,
          category_display_name: category.display_name,
          keywords: [],
        };

        categorizedPosts[categoryName].push(post);
      });

      // 질문 데이터 처리 개선
      const questionsData = questionsResult.data || [];
      questionsData.forEach((item) => {
        const category = item.question_categories;
        if (!isValidCategory(category)) return;

        const categoryName = category.name as "daily" | "growth" | "custom";

        // 통계 증가
        domainStats[categoryName]++;

        // 게시물 생성
        const post: NeighborPost = {
          id: item.id,
          type: "question",
          title: item.title,
          content: item.content || "",
          date: item.date,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category_id: item.category_id,
          category_name: categoryName,
          category_display_name: category.display_name,
          is_answered: item.is_answered,
          answer: item.answer,
          keywords: [],
        };

        categorizedPosts[categoryName].push(post);
      });

      // 이웃 정보 구성
      const neighborInfo: NeighborInfo = {
        id: neighborRelation.id,
        user_id: profileData.id,
        name: profileData.name,
        nickname: profileData.nickname,
        accepted_at: neighborRelation.updated_at,
        mutual_friends_count: 0,
        last_active: profileData.updated_at,
      };

      const neighborDetailData: NeighborDetailData = {
        profile: neighborInfo,
        domainStats: domainStats,
        posts: categorizedPosts,
      };

      setData(neighborDetailData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "프로필을 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("Failed to fetch neighbor profile:", err);
    } finally {
      setLoading(false);
    }
  }, [neighborId]);

  useEffect(() => {
    if (neighborId) {
      fetchNeighborProfile();
    }
  }, [fetchNeighborProfile]);

  // 현재 도메인에 따른 게시물 필터링
  const currentPosts = data?.posts[activeDomain] || [];
  const totalPosts = data
    ? Object.values(data.domainStats).reduce((sum, count) => sum + count, 0)
    : 0;

  return {
    data,
    loading,
    error,
    activeDomain,
    currentPosts,
    totalPosts,
    setActiveDomain,
    fetchNeighborProfile,
  };
};
