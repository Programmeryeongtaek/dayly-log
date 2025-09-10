import { NeighborInfo, NeighborRequest } from '@/types/my/database'
import { NeighborFilters } from '@/types/my/ui';
import { useCallback, useEffect, useState } from 'react'

export const useMyNeighbors = () => {
  const [requests, setRequests] = useState<NeighborRequest[]>([]);
  const [neighbors, setNeighbors] = useState<NeighborInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NeighborFilters>({
    search: '',
  });

  const fetchNeighbors = useCallback(async () => {
    try {
      setLoading(true);

      const mockRequests: NeighborRequest[] = [
        {
          id: '1',
          requester_id: 'user1',
          requester_name: '김민수',
          requester_nickname: 'minsu_kim',
          created_at: '2024-12-19T10:00:00Z',
          status: 'pending',
        },
        {
          id: '2',
          requester_id: 'user2',
          requester_name: '박지은',
          requester_nickname: 'jieun_park',
          created_at: '2024-12-18T15:30:00Z',
          status: 'pending',
        },
      ];

      const mockNeighbors: NeighborInfo[] = [
        {
          id: '1',
          user_id: 'neighbor1',
          name: '이지은',
          nickname: 'jieun_lee',
          accepted_at: '2024-12-15T14:30:00Z',
          mutual_friends_count: 3,
          last_active: '2024-12-19T09:00:00Z',
        },
        {
          id: '2',
          user_id: 'neighbor2',
          name: '최현우',
          nickname: 'hyunwoo_choi',
          accepted_at: '2024-12-10T11:20:00Z',
          mutual_friends_count: 1,
          last_active: '2024-12-18T20:15:00Z',
        },
        {
          id: '3',
          user_id: 'neighbor3',
          name: '정수아',
          nickname: 'sua_jung',
          accepted_at: '2024-12-05T09:45:00Z',
          mutual_friends_count: 0,
          last_active: '2024-12-17T14:20:00Z',
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setRequests(mockRequests);
      setNeighbors(mockNeighbors);
      setError(null);
    } catch (err) {
      setError('이웃 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch neighbors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<NeighborFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const acceptRequest = useCallback(async (requestId: string) => {
    try {
      console.log('Accepting request:', requestId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const acceptedRequest = requests.find(req => req.id === requestId);
      if (acceptedRequest) {
        // 요청 목록에서 제거
        setRequests(prev => prev.filter(req => req.id !== requestId));
        
        // 이웃 목록에 추가
        const newNeighbor: NeighborInfo = {
          id: `neighbor_${Date.now()}`,
          user_id: acceptedRequest.requester_id,
          name: acceptedRequest.requester_name,
          nickname: acceptedRequest.requester_nickname,
          accepted_at: new Date().toISOString(),
          mutual_friends_count: 0,
          last_active: new Date().toISOString(),
        };
        setNeighbors(prev => [newNeighbor, ...prev]);
      }
    } catch (err) {
      setError('이웃 요청 수락에 실패했습니다.');
      console.error('Failed to accept request:', err);
    }
  }, [requests]);

  const declineRequest = useCallback(async (requestId: string) => {
    try {
      console.log('Declining request:', requestId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      setError('이웃 요청 거절에 실패했습니다.');
      console.error('Failed to decline request:', err);
    }
  }, []);

  const removeNeighbor = useCallback(async (neighborId: string) => {
    try {
      console.log('Removing neighbor:', neighborId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNeighbors(prev => prev.filter(neighbor => neighbor.id !== neighborId));
    } catch (err) {
      setError('이웃 삭제에 실패했습니다.');
      console.error('Failed to remove neighbor:', err);
    }
  }, []);

  const sendMessage = useCallback(async (neighborId: string) => {
    try {
      console.log('Sending message to neighbor:', neighborId);
      // TODO: 메시지 보내기 기능 구현
    } catch (err) {
      setError('메시지 보내기에 실패했습니다.');
      console.error('Failed to send message:', err);
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