import { useCallback, useState } from "react";

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
