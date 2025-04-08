import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  isLoggedIn: boolean;
  onSearch: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isLoggedIn, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    setIsLoading(true);
    onSearch(searchQuery);
    setSearchQuery(''); // Reset search query after submission
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call delay
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateAndCloseMenu = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Menu
              className="h-6 w-6 text-gray-600 cursor-pointer sm:hidden"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            />
            <h1
              className={`text-xl font-bold cursor-pointer ${
                isActive('/') ? 'text-blue-700' : 'text-blue-600'
              }`}
              onClick={() => navigate('/')}
            >
              NewsIO
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                aria-label="Search Icon"
              />
              <input
                type="text"
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label="Submit Search"
              >
                {isLoading ? 'Loading...' : 'Go'}
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                onClick={() => navigate('/login')}
                aria-label="Login"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md sm:hidden">
            <ul className="p-4 space-y-2">
              <li>
                <button onClick={() => navigateAndCloseMenu('/')} className="w-full text-left">
                  Home
                </button>
              </li>
              {!isLoggedIn && (
                <li>
                  <button onClick={() => navigateAndCloseMenu('/login')} className="w-full text-left">
                    Login
                  </button>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button onClick={() => navigateAndCloseMenu('/profile')} className="w-full text-left">
                    Profile
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};