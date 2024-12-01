import { NewsArticle } from '../types';
import { RSS_FEEDS } from '../config/rssFeeds';
import { mockArticles } from './mockData';
import { extractArticleContent } from './articleExtractor';

async function parseXMLToJSON(xmlText: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');
  
  return Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    content: item.querySelector('content\\:encoded, content')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
    guid: item.querySelector('guid')?.textContent || '',
    pubDate: item.querySelector('pubDate')?.textContent || '',
  }));
}

async function fetchSingleFeed(feedUrl: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlText = await response.text();
    const items = await parseXMLToJSON(xmlText);
    
    // Process items sequentially to avoid overwhelming the server
    const articles = [];
    for (const item of items) {
      const content = item.content || await extractArticleContent(item.link);
      
      articles.push({
        id: item.guid || item.link || Math.random().toString(36).slice(2),
        title: item.title || 'Untitled',
        description: item.description?.replace(/<[^>]*>/g, '') || '',
        content: content?.replace(/<[^>]*>/g, '') || '',
        url: item.link || '',
        source: sourceName,
        publishedAt: item.pubDate || new Date().toISOString(),
      });
    }
    
    return articles;
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const feedPromises = RSS_FEEDS.map(feed => 
      fetchSingleFeed(`${corsProxy}${encodeURIComponent(feed.url)}`, feed.name)
    );

    const results = await Promise.allSettled(feedPromises);
    const articles = results
      .filter((result): result is PromiseFulfilledResult<NewsArticle[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 50); // Limit to 50 most recent articles

    if (articles.length === 0) {
      console.log('No RSS feeds available, using mock data');
      return mockArticles;
    }

    return articles;
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return mockArticles;
  }
}