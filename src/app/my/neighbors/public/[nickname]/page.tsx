"use client";

import { useAuth } from "@/hooks/auth";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Share2,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicProfile {
  id: string;
  name: string;
  nickname: string;
  created_at: string;
}

interface NeighborStatus {
  status: "none" | "pending_sent" | "pending_received" | "accepted";
  relationshipId?: string;
}

const PublicNeighborProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const nickname = params?.nickname as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [neighborStatus, setNeighborStatus] = useState<NeighborStatus>({
    status: "none",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, nickname, created_at")
        .eq("nickname", nickname)
        .single();

      if (profileError) {
        if (profileError.code === "PGRST116") {
          setError("존재하지 않는 사용자입니다.");
        } else {
          throw profileError;
        }
        return;
      }

      setProfile(profileData);

      if (user && user.id !== profileData.id) {
        await checkNeighborStatus(profileData.id);
      } else if (user && user.id === profileData.id) {
        setNeighborStatus({ status: "none" });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "프로필을 불러오는데 실패했습니다.",
      );
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkNeighborStatus = async (profileId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("neighbor_relationships")
        .select("id, status, requester_id, recipient_id")
        .or(
          `and(requester_id.eq.${user.id},recipient_id.eq.${profileId}),and(requester_id.eq.${profileId},recipient_id.eq.${user.id})`,
        )
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNeighborStatus({ status: "none" });
      } else {
        if (data.status === "accepted") {
          setNeighborStatus({ status: "accepted", relationshipId: data.id });
        } else if (data.status === "pending") {
          if (data.requester_id === user.id) {
            setNeighborStatus({
              status: "pending_sent",
              relationshipId: data.id,
            });
          } else {
            setNeighborStatus({
              status: "pending_received",
              relationshipId: data.id,
            });
          }
        } else {
          setNeighborStatus({ status: "none" });
        }
      }
    } catch (err) {
      console.error("Failed to check neighbor status:", err);
    }
  };

  const sendNeighborRequest = async () => {
    if (!user || !profile) return;

    try {
      setActionLoading(true);

      const { error } = await supabase.from("neighbor_relationships").insert({
        requester_id: user.id,
        recipient_id: profile.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          setError("이미 이웃 요청을 보냈거나 이웃 관계입니다.");
        } else {
          throw error;
        }
        return;
      }

      setNeighborStatus({ status: "pending_sent" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이웃 신청에 실패했습니다.",
      );
      console.error("Failed to send neighbor request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const acceptNeighborRequest = async () => {
    if (!neighborStatus.relationshipId) return;

    try {
      setActionLoading(true);

      const { error } = await supabase
        .from("neighbor_relationships")
        .update({ status: "accepted" })
        .eq("id", neighborStatus.relationshipId);

      if (error) throw error;

      setNeighborStatus({
        status: "accepted",
        relationshipId: neighborStatus.relationshipId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이웃 요청 수락에 실패했습니다.",
      );
      console.error("Failed to accept neighbor request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const declineNeighborRequest = async () => {
    if (!neighborStatus.relationshipId) return;

    try {
      setActionLoading(true);

      const { error } = await supabase
        .from("neighbor_relationships")
        .update({ status: "declined" })
        .eq("id", neighborStatus.relationshipId);

      if (error) throw error;

      setNeighborStatus({ status: "none" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이웃 요청 거절에 실패했습니다.",
      );
      console.error("Failed to decline neighbor request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const shareProfile = async () => {
    const url = `${window.location.origin}/my/neighbors/public/${nickname}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}님의 프로필`,
          text: `${profile?.name}님과 이웃이 되어보세요!`,
          url: url,
        });
      } catch {
        // 사용자가 공유를 취소한 경우 무시
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("링크가 복사되었습니다.");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
  };

  const getActionButton = () => {
    if (!user) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">
            이웃 신청을 하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors"
          >
            로그인
          </button>
        </div>
      );
    }

    if (user.id === profile?.id) {
      return (
        <div className="text-center py-4">
          <button
            onClick={shareProfile}
            className="flex items-center space-x-2 px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors mx-auto hover:cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>프로필 공유</span>
          </button>
        </div>
      );
    }

    switch (neighborStatus.status) {
      case "none":
        return (
          <button
            onClick={sendNeighborRequest}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-accent-400 text-white rounded-lg hover:bg-accent-500 disabled:opacity-50 transition-colors w-full justify-center hover:cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>{actionLoading ? "신청 중..." : "이웃 신청"}</span>
          </button>
        );

      case "pending_sent":
        return (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-100 text-accent-800 rounded-lg hover:cursor-not-allowed">
              <Calendar className="w-5 h-5" />
              <span>이웃 신청 대기 중...</span>
            </div>
          </div>
        );

      case "pending_received":
        return (
          <div className="space-y-3">
            <p className="text-center text-gray-700">
              이 사용자가 이웃 신청을 보냈습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={acceptNeighborRequest}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex-1 justify-center hover:cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>수락</span>
              </button>
              <button
                onClick={declineNeighborRequest}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex-1 justify-center hover:cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>거절</span>
              </button>
            </div>
          </div>
        );

      case "accepted":
        return (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg hover:cursor-not-allowed">
                <Users className="w-5 h-5" />
                <span>이미 이웃입니다.</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/my/neighbors")}
              className="w-full px-4 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors hover:cursor-pointer"
            >
              이웃 목록 보기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (nickname) {
      fetchProfile();
    }
  }, [nickname, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            프로필을 찾을 수 없습니다.
          </h2>
          <p className="text-red-600 mb-6">
            {error || "존재하지 않는 사용자입니다."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 hover:cursor-pointer hover:text-accent-400" />
          </button>
        </div>

        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <p className="text-accent-900 text-sm text-center">
            <span className="font-semibold">
              이웃이 되면 공개 설정한 게시물을 볼 수 있습니다. <br />
            </span>
            (단, 가계부는 공개되지 않습니다.)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-accent-400 to-accent-600 px-6 py-8 text-white">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-accent-700" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-blue-100 text-lg font-semibold">
                @{profile.nickname}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatJoinDate(profile.created_at)} 가입</span>
            </div>

            <div className="space-y-4">
              {getActionButton()}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNeighborProfilePage;
