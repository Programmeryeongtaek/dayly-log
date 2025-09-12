// 사용자 정보
export interface Profile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

// 이웃 관계
export interface NeighborRelationship {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
}

// 이웃 요청 정보 (프로필과 조인된 데이터)
export interface NeighborRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_nickname: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
}

// 이웃 정보 (상세 정보 포함)
export interface NeighborInfo {
  id: string;
  user_id: string;
  name: string;
  nickname: string;
  accepted_at: string;
  mutual_friends_count: number;
  last_active: string;
}

export interface NeighborProfile {
  id: string;
  name: string;
  nickname: string;
  accepted_at: string;
  mutual_friends_count: number;
  last_active: string;
}

export interface DomainStats  {
  gratitude: number;
  reflection: number;
  daily: number;
  growth: number;
  custom: number;
}

export interface NeighborPost {
  id: string;
  title?: string;
  content: string;
  date: string;
  category_id: string;
  category_name: 'gratitude' | 'reflection' | 'daily' | 'growth' | 'custom';
  category_display_name: string;
  is_answered?: boolean;
  answer?: string;
  keywords: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  created_at: string;
  updated_at: string;
}

// 회고 관련 타입들
export interface ReflectionItem {
  id: string;
  user_id: string;
  category_id: string;
  title?: string;
  content: string;
  date: string;
  is_public: boolean;
  is_neighbor_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReflectionCategory {
  id: string;
  name: 'gratitude' | 'reflection';
  display_name: string;
  description?: string;
  created_at: string;
}

export interface ReflectionKeyword {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ReflectionKeywordRelation {
  id: string;
  reflection_id: string;
  keyword_id: string;
  created_at: string;
}

// 질문 관련 타입
export interface QuestionItem {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  content?: string;
  answer?: string;
  date: string;
  is_public: boolean;
  is_neighbor_visible: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionCategory {
  id: string;
  name: 'daily' | 'growth' | 'custom';
  display_name: string;
  description?: string;
  created_at: string;
}

export interface QuestionKeyword {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionKeywordRelation {
  id: string;
  question_id: string;
  keyword_id: string;
  created_at: string;
}

// 스크랩 관련
export interface ScrapItem {
  id: string;
  user_id: string;
  content_type: 'reflection' | 'question';
  content_id: string;
  scraped_at: string;
  created_at: string;
}

// 조인된 스크랩 정보 (작성자 정보 포함)
export interface ScrapWithContent {
  id: string;
  user_id: string;
  content_type: 'reflection' | 'question';
  scraped_at: string;
  author: {
    id: string;
    name: string;
    nickname: string;
  };
  content: {
    id: string;
    title?: string;
    content: string;
    category: string;
    date: string;
    is_answered?: boolean;
    answer?: string;
    keywords: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
}

// 통계 타입
export interface MyStats {
  total_posts: number;
  total_reflections: number;
  total_questions: number;
  answered_questions: number;
  total_neighbors: number;
  pending_requests: number;
  total_scraps: number;
  this_week_posts: number;
  this_week_scraps: number;
  this_week_new_neighbors: number;
}

// API 응답 타입
export interface PostsResponse {
  reflections: ReflectionWithKeywords[];
  questions: QuestionWithKeywords[];
  total_count: number;
  has_more: boolean;
}

export interface NeighborsResponse {
  requests: NeighborRequest[];
  neighbors: NeighborInfo[];
  stats: {
    total_neighbors: number;
    pending_requests: number;
    new_this_week: number;
  };
}

export interface ScrapsResponse {
  scraps: ScrapWithContent[];
  total_count: number;
  has_more: boolean;
}

// 키워드와 함께 조인된 타입
export interface ReflectionWithKeywords extends ReflectionItem {
  category: ReflectionCategory;
  keywords: ReflectionKeyword[];
}

export interface QuestionWithKeywords extends QuestionItem {
  category: QuestionCategory;
  keywords: QuestionKeyword[];
}

// 폼 데이터
export interface NeighborRequestData {
  recipient_id: string;
  message?: string;
}

export interface NeighborActionData {
  request_id: string;
  action: 'accept' | 'decline' | 'block';
}

export interface ScrapCreateData {
  content_type: 'reflection' | 'question';
  content_id: string;
}

export interface SearchParams {
  query?: string;
  content_type?: 'all' | 'reflections' | 'questions';
  date_from?: string;
  date_to?: string;
  category?: string;
  sort_by?: 'latest' | 'oldest' | 'content_date';
  limit?: number;
  offset?: number;
}