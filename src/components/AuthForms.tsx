import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/api'; // Import Supabase client

const newsCategories = [
  'Politics',
  'Technology',
  'Business',
  'Sports',
  'Entertainment',
  'Science',
  'Health',
];

const validatePassword = (password: string) => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
};

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    try {
      setError(''); // Reset error message
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(), // Assumes username is the user's email
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        setError('Login failed: ' + error.message);
      } else {
        console.log('Login successful:', data);
        onLogin(); // Call the onLogin callback
        navigate('/'); // Redirect to homepage
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                aria-label="Email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                aria-label="Password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/register')}
            >
              Don't have an account? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
    preferences: [] as string[],
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and include a number and a special character.');
      return;
    }
    setIsLoading(true); // Set loading state
    try {
      setError(''); // Reset error message
      setSuccess(''); // Reset success message
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            mobile_number: formData.mobileNumber,
            preferences: formData.preferences,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error.message);
        setError('Registration failed: ' + error.message);
      } else {
        console.log('Registration successful:', data);
        setSuccess('Account created successfully! Redirecting to login...');
        setFormData({
          username: '',
          password: '',
          email: '',
          mobileNumber: '',
          preferences: [],
        });
        setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handlePreferenceChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(category)
        ? prev.preferences.filter((p) => p !== category)
        : [...prev.preferences, category],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="text"
              aria-label="Username"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <input
              type="password"
              aria-label="Password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <input
              type="email"
              aria-label="Email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              type="tel"
              aria-label="Mobile Number"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Mobile Number (Optional)"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))
              }
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                News Preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                {newsCategories.map((category) => (
                  <label
                    key={category}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Preference for ${category}`}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.preferences.includes(category)}
                      onChange={() => handlePreferenceChange(category)}
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};