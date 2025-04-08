import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { Profile } from './components/Profile';
import NewsList from './components/NewsList'; // Import NewsList
import { User, SurveyQuestion } from './types';

// Mock user and survey data (unchanged)
const mockUser: User = {
  username: 'johndoe',
  email: 'john@example.com',
  preferences: ['Technology', 'Science', 'Business'],
  mobileNumber: '+1234567890',
};

const mockSurveyQuestions: SurveyQuestion[] = [
  { id: '1', question: 'How satisfied are you with our news coverage?', rating: 4 },
  { id: '2', question: 'How would you rate the relevance of recommended articles?', rating: 3 },
  { id: '3', question: 'How likely are you to recommend our platform to others?', rating: 5 },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle search (for now, just logs; NewsList can use it later if needed)
  const handleSearch = (query: string) => {
    console.log('Search query from Navigation:', query);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation isLoggedIn={isLoggedIn} onSearch={handleSearch} />
        
        <Routes>
          {/* Homepage with NewsList */}
          <Route
            path="/"
            element={
              <main className="container mx-auto px-4 py-8 mt-16">
                <NewsList />
              </main>
            }
          />
          {/* Login Route */}
          <Route 
            path="/login" 
            element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} 
          />
          {/* Register Route */}
          <Route path="/register" element={<RegisterForm />} />
          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile
                  user={mockUser}
                  recommendedNews={[]} // Empty for now, can connect to NewsList later
                  surveyQuestions={mockSurveyQuestions}
                  onUpdatePreferences={() => console.log('Update preferences')}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;