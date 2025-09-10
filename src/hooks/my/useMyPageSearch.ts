import { useMemo } from 'react';

interface Keyword {
  id: string;
  name: string;
  color: string;
}

interface SearchableItem {
  content: string;
  keywords?: Keyword[];
}

export const useMyPageSearch = <T extends SearchableItem>(
  data: T[],
  searchTerm: string,
) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => {
      const contentMatch = item.content.toLowerCase().includes(searchLower);
      const keywordMatch = item.keywords?.some(keyword =>
        keyword.name.toLowerCase().includes(searchLower)
      ) || false;

      return contentMatch || keywordMatch;
    });
  }, [data, searchTerm]);
};