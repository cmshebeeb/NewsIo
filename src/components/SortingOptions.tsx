import React from 'react';
import { ArrowDownAZ, Flame, TrendingUp } from 'lucide-react';

type SortOption = 'latest' | 'popular' | 'trending';

interface SortingOptionsProps {
  currentSort: SortOption;
  onSort: (option: SortOption) => void;
}

export const SortingOptions: React.FC<SortingOptionsProps> = ({
  currentSort,
  onSort,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSort('latest')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          currentSort === 'latest'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        } hover:bg-blue-700 hover:text-white transition-colors`}
      >
        <ArrowDownAZ className="h-4 w-4" />
        Latest
      </button>
      <button
        onClick={() => onSort('popular')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          currentSort === 'popular'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        } hover:bg-blue-700 hover:text-white transition-colors`}
      >
        <Flame className="h-4 w-4" />
        Popular
      </button>
      <button
        onClick={() => onSort('trending')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          currentSort === 'trending'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        } hover:bg-blue-700 hover:text-white transition-colors`}
      >
        <TrendingUp className="h-4 w-4" />
        Trending
      </button>
    </div>
  );
};