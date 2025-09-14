import { supabase } from "@/lib/supabase";
import { NeighborFilters, NeighborInfo, NeighborRequest } from "@/types/my";
import { useCallback, useEffect, useState } from "react";

export const useMyNeighbors = () => {
  const [requests, setRequests] = useState<NeighborRequest[]>([]);
  const [neighbors, setNeighbors] = useState<NeighborInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NeighborFilters>({
    search: "",
  });

  const fetchNeighbors = useCallback(async () => {
    try {
      setLoading(true);

      // 현재 사용자 ID 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("인증이 필요합니다.");

      // 이웃 요청 목록 가져오기
      const { data: requestsData, error: requestsError } = await supabase
        .from("neighbor_status_view")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;

      // 이웃 목록 가져오기
      const { data: neighborsData, error: neighborsError } = await supabase
        .from("neighbor_status_view")
        .select("*")
        .or(
          `and(requester_id.eq.${user.id},status.eq.accepted),and(recipient_id.eq.${user.id},status.eq.accepted)`,
        )
        .order("updated_at", { ascending: false });

      if (neighborsError) throw neighborsError;

      // 요청 데이터 변환
      const requests: NeighborRequest[] = (requestsData || []).map((req) => ({
        id: req.id,
        requester_id: req.requester_id,
        requester_name: req.requester_name,
        requester_nickname: req.requester_nickname,
        created_at: req.created_at,
        status: req.status,
      }));

      // 이웃 데이터 변환
      const neighbors: NeighborInfo[] = (neighborsData || []).map(
        (neighbor) => {
          const isRequester = neighbor.requester_id === user.id;
          return {
            id: neighbor.id,
            user_id: isRequester
              ? neighbor.recipient_id
              : neighbor.requester_id,
            name: isRequester
              ? neighbor.recipient_name
              : neighbor.requester_name,
            nickname: isRequester
              ? neighbor.recipient_nickname
              : neighbor.requester_nickname,
            accepted_at: neighbor.updated_at,
            mutual_friends_count: 0, // TODO: 상호 이웃 수 계산 쿼리 필요
            last_active: neighbor.updated_at,
          };
        },
      );

      setRequests(requests);
      setNeighbors(neighbors);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "이웃 데이터를 불러오는데 실패했습니다.",
      );
      console.error("Failed to fetch neighbors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<NeighborFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const acceptRequest = useCallback(
    async (requestId: string) => {
      try {
        const { error } = await supabase
          .from("neighbor_relationships")
          .update({ status: "accepted" })
          .eq("id", requestId);

        if (error) throw error;

        // 데이터 새로고침
        await fetchNeighbors();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "이웃 요청 수락에 실패했습니다.",
        );
        console.error("Failed to accept request:", err);
      }
    },
    [fetchNeighbors],
  );

  const declineRequest = useCallback(async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("neighbor_relationships")
        .update({ status: "declined" })
        .eq("id", requestId);

      if (error) throw error;

      // 요청 목록에서 제거
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이웃 요청 거절에 실패했습니다.",
      );
      console.error("Failed to decline request:", err);
    }
  }, []);

  const removeNeighbor = useCallback(async (neighborId: string) => {
    try {
      const { error } = await supabase
        .from("neighbor_relationships")
        .delete()
        .eq("id", neighborId);

      if (error) throw error;

      // 이웃 목록에서 제거
      setNeighbors((prev) =>
        prev.filter((neighbor) => neighbor.id !== neighborId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이웃 삭제에 실패했습니다.",
      );
      console.error("Failed to remove neighbor:", err);
    }
  }, []);

  const sendMessage = useCallback(async (neighborId: string) => {
    try {
      console.log("Sending message to neighbor:", neighborId);
      // TODO: 메시지 보내기 기능 구현
    } catch (err) {
      setError("메시지 보내기에 실패했습니다.");
      console.error("Failed to send message:", err);
    }
  }, []);

  useEffect(() => {
    fetchNeighbors();
  }, [fetchNeighbors]);

  return {
    neighbors: { requests, list: neighbors },
    filters,
    loading,
    error,
    actions: {
      updateFilters,
      acceptRequest,
      declineRequest,
      removeNeighbor,
      sendMessage,
      refresh: fetchNeighbors,
    },
  };
};
