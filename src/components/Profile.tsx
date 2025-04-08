import React, { useState, useEffect } from 'react';
import { Star, Settings, Calendar, Clock, LogOut } from 'lucide-react';
import { User, SurveyQuestion, NewsArticle } from '../types';
import { InterestGraph } from './InterestGraph';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
  recommendedNews: NewsArticle[];
  surveyQuestions: SurveyQuestion[];
  onUpdatePreferences: () => void;
  onLogout: () => void;
  onProfileUpdate?: (updatedUser: Partial<User>) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  recommendedNews,
  surveyQuestions: initialSurveyQuestions,
  onUpdatePreferences,
  onLogout,
  onProfileUpdate,
}) => {
  const navigate = useNavigate();
  const [showTodaySummary, setShowTodaySummary] = useState(false);
  const [showWeekSummary, setShowWeekSummary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [nextSurveyTime, setNextSurveyTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0 });
  const [editForm, setEditForm] = useState({
    username: user.username,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    preferences: [...user.preferences],
  });
  const [localSurveyQuestions, setLocalSurveyQuestions] = useState<SurveyQuestion[]>(initialSurveyQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interestData, setInterestData] = useState<
    { category: string; value: number; percentage: number; previousPercentage: number }[]
  >([]);

  // Mock summaries - Replace with AI-generated content
  const todaySummary = "Today you've shown interest in AI advancements and quantum computing. Several breakthrough articles caught your attention, particularly in technology sector...";
  const weekSummary = "This week your reading patterns show increased engagement with scientific discoveries and tech innovations. You've spent most time reading about AI and quantum computing...";

  useEffect(() => {
    if (surveySubmitted) {
      const next = new Date();
      next.setHours(next.getHours() + 12);
      setNextSurveyTime(next);
    }
  }, [surveySubmitted]);

  useEffect(() => {
    if (nextSurveyTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = nextSurveyTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setSurveySubmitted(false);
          setNextSurveyTime(null);
          clearInterval(timer);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setCountdown({ hours, minutes });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [nextSurveyTime]);

  useEffect(() => {
    setLocalSurveyQuestions(initialSurveyQuestions);
  }, [initialSurveyQuestions]);

  useEffect(() => {
    const fetchInterestData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/interest-data');
        if (!response.ok) throw new Error('Failed to fetch interest data');
        const data = await response.json();
        setInterestData(data);
      } catch {
        setError('Failed to load interest data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterestData();
  }, []);

  const handleRatingChange = (questionId: string, newRating: number) => {
    const updatedQuestions = localSurveyQuestions.map(q =>
      q.id === questionId ? { ...q, rating: newRating } : q
    );
    setLocalSurveyQuestions(updatedQuestions);
  };

  const handleSubmitSurvey = async () => {
    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSurveyQuestions),
      });
      if (!response.ok) throw new Error('Failed to submit survey');
      setSurveySubmitted(true);
    } catch {
      setError('Failed to submit survey');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editForm.username,
          oldPassword: editForm.oldPassword,
          newPassword: editForm.newPassword || undefined,
          preferences: editForm.preferences,
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedUser = await response.json();
      if (onProfileUpdate) onProfileUpdate(updatedUser);
      setIsEditing(false);
    } catch {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleSurveyResponse = async (id: string, rating: number) => {
    try {
      setLocalSurveyQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, rating } : q))
      );
      const response = await fetch('/api/update-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rating }),
      });
      if (!response.ok) throw new Error('Failed to update survey response');
    } catch {
      setLocalSurveyQuestions(initialSurveyQuestions);
      setError('Failed to submit survey response');
    }
  };

  const categories = ['Technology', 'Health', 'Finance', 'Sports', 'Entertainment'];

  if (isLoading) return <p className="text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-wrap gap-8">
        {/* User Info and Edit Profile - Fixed width */}
        <div className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700"
                aria-label="Edit Profile"
              >
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
                aria-label="Log Out"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <input
                  type="password"
                  value={editForm.oldPassword}
                  onChange={(e) => setEditForm({ ...editForm, oldPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.mobileNumber && (
                <div>
                  <label className="text-sm text-gray-500">Mobile</label>
                  <p className="font-medium">{user.mobileNumber}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Preferences</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.preferences.map((pref) => (
                    <span
                      key={pref}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interest Trends Graph */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Interest Trends</h3>
            <InterestGraph data={interestData} />
          </div>

          {/* Summary Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowTodaySummary(!showTodaySummary)}
              className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="h-5 w-5" />
              Your Today
            </button>
            <button
              onClick={() => setShowWeekSummary(!showWeekSummary)}
              className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Week of You
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 space-y-8">
          {/* Today's Summary Modal */}
          {showTodaySummary && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Today</h3>
                <button
                  onClick={() => setShowTodaySummary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700">{todaySummary}</p>
            </div>
          )}

          {/* Week Summary Modal */}
          {showWeekSummary && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Week of You</h3>
                <button
                  onClick={() => setShowWeekSummary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700">{weekSummary}</p>
            </div>
          )}

          {/* Survey Section - Collapsible */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Rate your experience</h2>
            {surveySubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Thank you for your feedback! Next survey will be available in:
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {countdown.hours}h {countdown.minutes}m
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {localSurveyQuestions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <p className="font-medium">{question.question}</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            rating <= question.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                          onClick={() => handleRatingChange(question.id, rating)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSubmitSurvey}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>

          {/* Recommended News - Expanded */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
            <div className="grid grid-cols-1 gap-6">
              {recommendedNews.map((article) => (
                <div
                  key={article.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transform transition-transform hover:scale-105"
                >
                  <h3 className="font-medium mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                  >
                    Read full article →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};