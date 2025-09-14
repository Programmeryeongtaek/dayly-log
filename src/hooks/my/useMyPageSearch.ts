import { useCallback, useMemo, useState } from "react";

export const useMyPageSearch = <
  T extends { content: string; keywords?: { name: string }[] },
>(
  data: T[],
  searchTerm: string,
) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter((item) => {
      const contentMatch = item.content.toLowerCase().includes(searchLower);
      const keywordMatch =
        item.keywords?.some((keyword) =>
          keyword.name.toLowerCase().includes(searchLower),
        ) || false;

      return contentMatch || keywordMatch;
    });
  }, [data, searchTerm]);
};

// 액션 로딩 상태 Hook
export const useActionLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const setLoading = useCallback((actionId: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [actionId]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (actionId: string) => {
      return loadingStates[actionId] || false;
    },
    [loadingStates],
  );

  const withLoading = useCallback(
    async <T>(actionId: string, action: () => Promise<T>): Promise<T> => {
      setLoading(actionId, true);
      try {
        return await action();
      } finally {
        setLoading(actionId, false);
      }
    },
    [setLoading],
  );

  return {
    isLoading,
    setLoading,
    withLoading,
  };
};
