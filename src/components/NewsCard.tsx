import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import { ChatBot } from './ChatBot';

export interface NewsCardProps {
  article: NewsArticle;
  onLike: () => void;
  onDislike: () => void;
  isLoggedIn: boolean;
  onChat: () => void; // Kept since it might be used elsewhere (e.g., ChatBot trigger)
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onLike,
  onDislike,
  isLoggedIn,
  onChat,
}) => {
  console.log('Article image data:', {
    imageUrl: article.imageUrl,
    urlToImage: article.urlToImage,
  });

  const [showChat, setShowChat] = useState(false);
  const [likes, setLikes] = useState(article.likes ?? 0); // Double ?? for explicit fallback
  const [dislikes, setDislikes] = useState(article.dislikes ?? 0); // Double ?? for explicit fallback
  const [userInteraction, setUserInteraction] = useState<'like' | 'dislike' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullContent, setFullContent] = useState<string | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', article.imageUrl || article.urlToImage);
    e.currentTarget.src = '/placeholder.png';
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      alert('Please log in to like articles');
      return;
    }
    if (userInteraction === 'like') {
      setLikes(prev => prev - 1);
      setUserInteraction(null);
    } else {
      if (userInteraction === 'dislike') {
        setDislikes(prev => prev - 1);
      }
      setLikes(prev => prev + 1);
      setUserInteraction('like');
    }
    onLike();
  };

  const handleDislike = () => { // Fixed syntax error
    if (!isLoggedIn) {
      alert('Please log in to dislike articles');
      return;
    }
    if (userInteraction === 'dislike') {
      setDislikes(prev => prev - 1);
      setUserInteraction(null);
    } else {
      if (userInteraction === 'like') {
        setLikes(prev => prev - 1);
      }
      setDislikes(prev => prev + 1);
      setUserInteraction('dislike');
    }
    onDislike();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleCardClick = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      try {
        const response = await fetch(article.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setFullContent(data);
      } catch (error) {
        console.error('Error fetching full article:', error);
        setFullContent('Failed to load full article content.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      action();
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown} // Added for accessibility
        role="button" // Added for accessibility
        tabIndex={0} // Added for accessibility
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer ${
          isExpanded ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl h-5/6 overflow-y-auto z-50' : 'hover:shadow-lg'
        }`}
      >
        <img
          src={article.imageUrl || article.urlToImage || '/placeholder.png'}
          alt={article.title || 'News article image'} // Added fallback
          className={`w-full object-cover transition-all duration-300 ${
            isExpanded ? 'h-96' : 'h-48'
          }`}
          onError={handleImageError}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{article.title || 'Untitled'}</h3>
            <span className="text-sm text-gray-500">{getTimeAgo(article.published_at)}</span>
          </div>
          
          <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {article.description || 'No description available'}
          </p>
          
          {isExpanded && (
            <div className="mt-4">
              <div className="prose max-w-none">
                {fullContent ? (
                  <p className="text-gray-700">{fullContent}</p>
                ) : (
                  <p className="text-gray-500">Loading full article...</p>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Source: {article.source.name}</p>
                <p>Category: {article.category}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                onKeyDown={(e) => handleButtonKeyDown(e, handleLike)} // Added for accessibility
                className={`flex items-center space-x-1 ${
                  userInteraction === 'like'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{likes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDislike();
                }}
                onKeyDown={(e) => handleButtonKeyDown(e, handleDislike)} // Added for accessibility
                className={`flex items-center space-x-1 ${
                  userInteraction === 'dislike'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{dislikes}</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(true);
                  onChat(); // Used here
                }}
                onKeyDown={(e) => handleButtonKeyDown(e, () => {
                  setShowChat(true);
                  onChat();
                })} // Added for accessibility
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat</span>
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Read More</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsExpanded(false);
            setFullContent(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsExpanded(false);
              setFullContent(null);
            }
          }} // Added for accessibility
          role="button" // Added for accessibility
          tabIndex={0} // Added for accessibility
        />
      )}

      {showChat && (
        <ChatBot articleId={article.id} onClose={() => setShowChat(false)} />
      )}
    </>
  );
};