import { createClient } from '@supabase/supabase-js';
import { MinifluxEntry, NewsArticle } from '../types';

// API Configuration using Environment Variables
export const API_CONFIG = {
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY || '2fe51de664a64956ac332834ea7fa5ea',
  BASE_URL: 'https://newsapi.org/v2/everything?q=',
  MINIFLUX_URL: import.meta.env.VITE_MINIFLUX_URL || 'https://miniflux.rithask.me/v1/entries',
  MINIFLUX_API_KEY: import.meta.env.VITE_MINIFLUX_API_KEY || 'NHbEvdWuJS1rgVbj5OI3YJGNusMVqLmBoTriADKox0g=',
};

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Debug utility
const debug = (message: string, data?: unknown) => {
  if (import.meta.env.MODE === 'development') {
    console.log(message, data);
  }
};

// Fetch NewsAPI articles and store new ones
export const fetchNews = async (query: string, page: number): Promise<NewsArticle[]> => {
  const url = `${API_CONFIG.BASE_URL}${encodeURIComponent(query)}&page=${page}&apiKey=${API_CONFIG.NEWS_API_KEY}`;
  try {
    debug('Fetching news from URL:', url);
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.status === 'ok' && Array.isArray(data.articles)) {
      const articles: NewsArticle[] = data.articles.map((article: { url: string; title?: string; description?: string; urlToImage?: string; source?: { name: string }; published_at?: string }) => ({
        id: article.url,
        title: article.title || 'Untitled Article',
        description: article.description || 'No description available.',
        content: article.description || 'No content available.',
        imageUrl: article.urlToImage || '/placeholder.png',
        source: { name: article.source?.name || 'Unknown Source' },
        published_at: article.published_at || new Date().toISOString(),
        category: query,
        likes: 0,
        dislikes: 0,
        url: article.url,
      }));

      const urls = articles.map((a) => a.url);
      const { data: existing } = await supabase.from('news').select('url').in('url', urls);
      const existingUrls = new Set(existing?.map((item) => item.url) || []);

      const newArticles = articles.filter((article) => !existingUrls.has(article.url));

      if (newArticles.length > 0) {
        const { error } = await supabase.from('news').insert(newArticles);
        if (error) {
          console.error('Error saving to Supabase:', error.message);
        } else {
          debug('Successfully saved new news to Supabase:', newArticles);
        }
      } else {
        debug('No new articles to save from NewsAPI');
      }
      return newArticles;
    } else {
      console.error('Error fetching news:', data.message || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.error('Network or API error:', (error instanceof Error ? error.message : error));
    return [];
  }
};

// Fetch Miniflux articles and store new ones
export const fetchMinifluxNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(API_CONFIG.MINIFLUX_URL, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_CONFIG.MINIFLUX_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Miniflux API error: ${response.statusText}`);
    }

    const data: { entries: MinifluxEntry[] } = await response.json();
    const articles: NewsArticle[] = data.entries.map((entry: MinifluxEntry) => ({
      id: entry.id.toString(),
      title: entry.title || 'Untitled Article',
      description: entry.content ? entry.content.substring(0, 200) : 'No description available.',
      content: entry.content || 'No content available.',
      imageUrl: entry.feed.image || '/placeholder.png',
      source: { name: entry.feed.title || 'Miniflux Feed' },
      published_at: entry.published_at || new Date().toISOString(),
      category: entry.feed.category?.title || 'general',
      likes: 0,
      dislikes: 0,
      url: entry.url,
    }));

    const urls = articles.map((a) => a.url);
    const { data: existing } = await supabase.from('news').select('url').in('url', urls);
    const existingUrls = new Set(existing?.map((item) => item.url) || []);

    const newArticles = articles.filter((article) => !existingUrls.has(article.url));

    if (newArticles.length > 0) {
      const { error } = await supabase.from('news').insert(newArticles);
      if (error) {
        console.error('Error saving Miniflux articles to Supabase:', error.message);
      } else {
        debug('Saved new Miniflux articles to Supabase:', newArticles);
      }
    } else {
      debug('No new articles to save from Miniflux');
    }
    return articles;
  } catch (error) {
    console.error('Miniflux API error:', (error instanceof Error ? error.message : error));
    return [];
  }
};

// Fetch cached news from Supabase
export const fetchCachedNews = async (offset = 0, limit = 20): Promise<NewsArticle[]> => {
  try {
    console.log('Fetching from Supabase with offset:', offset, 'limit:', limit);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('Supabase data:', data);
    return data.map(item => ({
      ...item,
      imageUrl: item.imageUrl || '/placeholder.png',
    })) as NewsArticle[];
  } catch (error) {
    console.error('Supabase query failed:', error);
    return [];
  }
};