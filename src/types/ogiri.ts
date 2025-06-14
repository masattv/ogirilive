export interface OgiriTopic {
  id: string;
  title: string;
  description: string;
  created_at: string;
  view_count: number;
  answer_count: number;
}

export interface OgiriAnswer {
  id: string;
  topic_id: string;
  content: string;
  user_name: string;
  created_at: string;
  ai_score?: number;
  ai_feedback?: string;
} 