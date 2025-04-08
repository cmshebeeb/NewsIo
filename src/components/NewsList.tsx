import React, { useEffect, useState } from 'react';
import { fetchNews, fetchMinifluxNews, fetchCachedNews } from '../config/api';
import { NewsCard } from './NewsCard';
import { NewsArticle } from '../types';

const NewsList: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [userPreference, setUserPreference] = useState('');
  const [isPopulating, setIsPopulating] = useState(false); // Add flag to prevent overlap

  const handleUserPreferenceChange = (preference: string) => {
    setUserPreference(preference);
    setPage(1);
    loadNews(true, preference);
  };

  const deduplicateArticles = (articles: NewsArticle[]): NewsArticle[] => {
    const seenUrls = new Set<string>();
    return articles.filter((article) => {
      if (seenUrls.has(article.url)) {
        console.log('Duplicate found and removed:', article.title);
        return false;
      }
      seenUrls.add(article.url);
      return true;
    });
  };

  const loadNews = async (reset: boolean = false, preference?: string) => {
    if (isPopulating) {
      console.log('Skipping loadNews, population in progress');
      return;
    }
    setLoading(true);
    setError(null);
  
    try {
      const category = preference || userPreference;
      console.log('Loading news for:', category || 'all categories', 'Reset:', reset);
  
      const offset = (reset ? 0 : page - 1) * 20;
      const cachedNews = await fetchCachedNews(offset, 20);
      console.log('Cached news:', cachedNews);
      let filteredNews = cachedNews;
      if (category) {
        filteredNews = cachedNews.filter((article) => article.category === category);
      }
      const uniqueCachedNews = deduplicateArticles(filteredNews);
      console.log('Unique cached news:', uniqueCachedNews);
      setArticles(reset ? uniqueCachedNews : deduplicateArticles([...articles, ...uniqueCachedNews]));
  
      if (!uniqueCachedNews.length && reset) {
        setError('No news available for this category yet. Please wait for news to be fetched.');
      }
    } catch (err) {
      console.error('Load news error:', err instanceof Error ? err.message : err);
      setError('Failed to load news. Showing cached data if available.');
    } finally {
      setLoading(false);
    }
  };

  const populateNews = async () => {
    if (isPopulating) return;
    setIsPopulating(true);
    setLoading(true);
    try {
      console.log('Populating Supabase with news...');
      const results = await Promise.all([
        fetchNews('technology', 1),
        fetchNews('technology', 2),
        fetchNews('sports', 1),
        fetchNews('sports', 2),
        fetchNews('health', 1),
        fetchNews('health', 2),
        fetchMinifluxNews(),
      ]);
      console.log('Populate results:', results);
      console.log('Finished populating Supabase');
      await loadNews(true, userPreference); // Ensure loadNews runs after populate
    } catch (err) {
      console.error('Populate news error:', err instanceof Error ? err.message : err);
    } finally {
      setIsPopulating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with userPreference:', userPreference);
    populateNews();
  }, [userPreference]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
    loadNews(false);
  };

  if (loading && !articles.length) {
    return <p className="text-center text-gray-600">Loading news...</p>;
  }

  if (error && !articles.length) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center mb-4">
        {['technology', 'sports', 'health'].map((category) => (
          <button
            key={category}
            onClick={() => handleUserPreferenceChange(category)}
            className={`px-4 py-2 mx-2 ${
              userPreference === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-lg hover:bg-blue-700 transition-colors`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
        <button
          onClick={() => handleUserPreferenceChange('')}
          className={`px-4 py-2 mx-2 ${
            userPreference === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          } rounded-lg hover:bg-blue-700 transition-colors`}
        >
          All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.url}
            article={article}
            onLike={() => console.log(`Liked: ${article.title}`)}
            onDislike={() => console.log(`Disliked: ${article.title}`)}
            onChat={() => console.log(`Chat about: ${article.title}`)}
            isLoggedIn={true}
          />
        ))}
      </div>

      {articles.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsList;