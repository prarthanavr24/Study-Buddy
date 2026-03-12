export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SavedTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: number;
}
