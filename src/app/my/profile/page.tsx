"use client";

import DomainPrivacyCard from "@/components/my/profile/DomainPrivacyCard";
import ProfilePreview from "@/components/my/profile/ProfilePreview";
import { useAuth } from "@/hooks/auth";
import {
  ArrowLeft,
  BookOpen,
  MessageCircleQuestion,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, profile, updateProfile } = useAuth();

  // 도메인별 공개 설정 상태
  const [domainSettings, setDomainSettings] = useState({
    reflections: "public" as "public" | "neighbors" | "private",
    questions: "neighbors" as "public" | "neighbors" | "private",
  });

  const [tempDomainSettings, setTempDomainSettings] = useState({
    reflections: "public" as "public" | "neighbors" | "private",
    questions: "neighbors" as "public" | "neighbors" | "private",
  });

  const handleSaveNickname = async (nickname: string) => {
    setLoading(true);
    try {
      await updateProfile({ nickname });
    } catch (error) {
      console.error("닉네임 업데이트 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainVisibilityChange = (
    domain: "reflections" | "questions",
    visibility: "public" | "neighbors" | "private",
  ) => {
    setTempDomainSettings((prev) => ({
      ...prev,
      [domain]: visibility,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setDomainSettings(tempDomainSettings);
      // TODO: API 호출로 도메인 설정 저장
      console.log("도메인 설정 저장:", tempDomainSettings);
      alert("설정이 저장되었습니다.");
    } catch (error) {
      console.error("설정 저장 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto py-8 p-4">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 items-start justify-start">
        <button onClick={() => router.push("/my")}>
          <ArrowLeft className="w-6 h-6 text-gray-500 hover:text-accent-400 hover:cursor-pointer" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">프로필 설정</h1>
      </div>

      <div className="space-y-6">
        <ProfilePreview
          user={profile}
          domainSettings={domainSettings}
          onNicknameChange={handleSaveNickname}
          isUpdatingNickname={loading}
        />

        {/* 도메인 공개 범위 설정 */}
        <div className="bg-white rounded-lg border">
          <div className="flex items-center gap-2 p-4 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              공개 범위 설정
            </h2>
          </div>

          <div className="flex justify-around">
            <DomainPrivacyCard
              icon={<BookOpen className="w-5 h-5 text-blue-600" />}
              title="회고"
              visibility={tempDomainSettings.reflections}
              onVisibilityChange={(visibility) =>
                handleDomainVisibilityChange("reflections", visibility)
              }
            />

            <DomainPrivacyCard
              icon={
                <MessageCircleQuestion className="w-5 h-5 text-green-600" />
              }
              title="질문"
              visibility={tempDomainSettings.questions}
              onVisibilityChange={(visibility) =>
                handleDomainVisibilityChange("questions", visibility)
              }
            />
          </div>

          <div className="mt-6 pt-4 ">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full px-4 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 disabled:opacity-50 transition-colors hover:cursor-pointer"
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
