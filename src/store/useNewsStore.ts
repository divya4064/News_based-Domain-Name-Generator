import { create } from 'zustand';
import { NewsArticle } from '../types';
import { fetchNewsArticles } from '../services/newsService';

interface NewsStore {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchArticles: () => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set) => ({
  articles: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      const articles = await fetchNewsArticles();
      set({ 
        articles, 
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        isLoading: false,
        articles: [], // Clear articles on error
        lastUpdated: new Date(),
      });
    }
  },
}));