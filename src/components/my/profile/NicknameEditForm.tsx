'use client';

import { Save, X } from 'lucide-react';
import { useState } from 'react';

const NicknameEditForm = ({
  currentNickname,
  onSave,
  onCancel,
  loading,
}: {
  currentNickname: string | null;
  onSave: (nickname: string) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const [nickname, setNickname] = useState(currentNickname || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSave(nickname.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading || !nickname.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? '저장 중...' : '저장'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <X className="w-4 h-4" />
          <span>취소</span>
        </button>
      </div>
    </form>
  );
};

export default NicknameEditForm;
