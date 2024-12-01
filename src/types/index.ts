export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface DomainSuggestion {
  name: string;
  available: boolean;
  tld: string;
  keywords: string[];
  score: number;
}

export interface RSSFeed {
  url: string;
  name: string;
}