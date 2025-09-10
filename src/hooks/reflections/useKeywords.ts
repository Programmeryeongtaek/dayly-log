import { supabase } from "@/lib/supabase";
import {
  Keyword,
  KeywordFormData,
  KeywordUsageStats,
} from "@/types/reflections";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useKeywords = (userId?: string, categoryId?: string) => {
  const queryClient = useQueryClient();

  // 키워드 목록 조회
  const {
    data: keywords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["keywords", userId, categoryId],
    queryFn: async (): Promise<Keyword[]> => {
      let query = supabase
        .from("reflection_keyword_stats")
        .select("*")
        .eq("user_id", userId!)
        .order("usage_count", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((stat) => ({
        id: stat.keyword_id,
        user_id: stat.user_id,
        category_id: stat.category_id,
        name: stat.keyword_name,
        color: stat.color || "#14b8a6",
        created_at: stat.created_at || "",
        updated_at: stat.updated_at || "",
        usage_count: stat.usage_count,
        gratitude_count: stat.gratitude_count || 0,
        reflection_count: stat.reflection_count || 0,
        first_used_date: stat.first_used_date,
        last_used_date: stat.last_used_date,
      }));
    },
    enabled: !!userId,
  });

  // 키워드 생성
  const createKeywordMutation = useMutation({
    mutationFn: async (formData: KeywordFormData & { user_id: string }) => {
      const keywordData = {
        ...formData,
        color: formData.color || "#14b8a6",
      };

      const { data, error } = await supabase
        .from("reflection_keywords")
        .insert([keywordData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    },
  });

  // 키워드 수정
  const updateKeywordMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<KeywordFormData>) => {
      const { data, error } = await supabase
        .from("reflection_keywords")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    },
  });

  // 키워드 삭제
  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reflection_keywords")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
    },
  });

  // 키워드 사용 통계 조회
  const { data: keywordStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ["keyword-stats", userId, categoryId],
    queryFn: async (): Promise<KeywordUsageStats[]> => {
      const { data, error } = await supabase
        .from("reflection_keyword_stats")
        .select("*")
        .eq("user_id", userId!)
        .order("usage_count", { ascending: false });

      if (error) throw error;

      return (data || []).map((stat) => ({
        keyword: {
          id: stat.keyword_id,
          user_id: stat.user_id,
          category_id: stat.category_id,
          name: stat.keyword_name,
          color: stat.color || "#14b8a6",
          created_at: stat.created_at || "",
          updated_at: stat.updated_at || "",
        },
        usageCount: stat.usage_count,
        gratitudeCount: stat.gratitude_count || 0,
        reflectionCount: stat.reflection_count || 0,
        lastUsedDate: stat.last_used_date,
        firstUsedDate: stat.first_used_date,
      }));
    },
    enabled: !!userId,
  });

  return {
    keywords,
    keywordStats,
    isLoading,
    isLoadingStats,
    error,
    createKeyword: createKeywordMutation.mutate,
    isCreatingKeyword: createKeywordMutation.isPending,
    updateKeyword: updateKeywordMutation.mutate,
    isUpdatingKeyword: updateKeywordMutation.isPending,
    deleteKeyword: deleteKeywordMutation.mutate,
    isDeletingKeyword: deleteKeywordMutation.isPending,
  };
};
