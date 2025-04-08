export interface User {
  username: string;
  email: string;
  preferences: string[];
  mobileNumber?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  source: {
    name: string;
  };
  published_at: string; // Changed from publishedAt to match Supabase
  category: string;
  likes: number;
  dislikes: number;
  url: string;
  urlToImage?: string; // Kept for compatibility
}

export interface SurveyQuestion {
  id: string;
  question: string;
  rating: number;
}

// Miniflux-specific types
export interface MinifluxFeed {
  title: string;
  image?: string;
  category?: {
    title: string;
  };
}

export interface MinifluxEntry {
  id: number;
  title: string;
  url: string;
  content: string;
  published_at: string;
  feed: MinifluxFeed;
}