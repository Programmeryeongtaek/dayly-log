"use client";

import { UserProfile } from "@/types/auth";
import {
  BookOpen,
  Edit3,
  Globe,
  Lock,
  MessageCircleQuestion,
  Save,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface ProfilePreviewProps {
  user: UserProfile;
  domainSettings: {
    reflections: "public" | "neighbors" | "private";
    questions: "public" | "neighbors" | "private";
  };
  onNicknameChange: (nickname: string) => void;
  isUpdatingNickname: boolean;
}

const ProfilePreview = ({
  user,
  domainSettings,
  onNicknameChange,
  isUpdatingNickname,
}: ProfilePreviewProps) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(user.nickname || "");

  const getVisibilityLabel = (level: "public" | "neighbors" | "private") => {
    switch (level) {
      case "public":
        return "전체";
      case "neighbors":
        return "이웃";
      case "private":
        return "비공개";
    }
  };

  const getVisibilityIcon = (level: "public" | "neighbors" | "private") => {
    switch (level) {
      case "public":
        return <Globe className="w-4 h-4 text-green-600" />;
      case "neighbors":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "private":
        return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSaveNickname = () => {
    if (nickname.trim() && nickname.trim() !== user.nickname) {
      onNicknameChange(nickname.trim());
      setIsEditingNickname(false);
    }
  };

  const handleCancelEdit = () => {
    setNickname(user.nickname || "");
    setIsEditingNickname(false);
  };

  return (
    <div className="bg-accent-50 p-4 border rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{user.name}</h4>

          {/* 닉네임 편집 영역 */}
          <div className="flex items-center space-x-2">
            {isEditingNickname ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-accent-500"
                  placeholder="닉네임을 입력하세요."
                  disabled={isUpdatingNickname}
                />
                <button
                  onClick={handleSaveNickname}
                  disabled={
                    isUpdatingNickname ||
                    !nickname.trim() ||
                    nickname.trim() === user.nickname
                  }
                  className="p-1 text-accent-600 rounded disabled:opacity-50 hover:cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdatingNickname}
                  className="p-1 text-red-600 hover:cursor-pointer rounded disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-accent-600">
                  @{user.nickname || "닉네임 없음"}
                </p>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="p-1 text-accent-600 rounded transition-colors hover:cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {new Date(user.created_at).toLocaleDateString()} 가입
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">회고</span>
          </div>
          <div className="flex items-center space-x-2">
            {getVisibilityIcon(domainSettings.reflections)}
            <span className="text-sm font-medium text-gray-600">
              {getVisibilityLabel(domainSettings.reflections)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center space-x-2">
            <MessageCircleQuestion className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">질문</span>
          </div>
          <div className="flex items-center space-x-2">
            {getVisibilityIcon(domainSettings.questions)}
            <span className="text-sm font-medium text-gray-600">
              {getVisibilityLabel(domainSettings.questions)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
