import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const displayName = `${firstName} ${lastName}`;
      await signup(email, password, displayName);
      navigate('/');
    } catch (error: any) {
      setError('Failed to create an account. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-2xl">in</span>
            </div>
          </div>
          <h1 className="text-3xl font-light text-[#000000] mb-2">
            Make the most of your professional life
          </h1>
        </div>
        
        {/* Form Card */}
        <div className="linkedin-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="linkedin-form-label">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="linkedin-input h-12"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="linkedin-form-label">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="linkedin-input h-12"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="linkedin-form-label">
                  Email or phone number
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="linkedin-input h-12"
                  placeholder="Email or phone number"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="linkedin-form-label">
                  Password (6+ characters)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="linkedin-input h-12 pr-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#666666]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#666666]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-[#666666]">
              By clicking Agree & Join, you agree to the LinkedIn{' '}
              <a href="#" className="text-[#0a66c2] hover:text-[#004182]">
                User Agreement
              </a>
              ,{' '}
              <a href="#" className="text-[#0a66c2] hover:text-[#004182]">
                Privacy Policy
              </a>
              , and{' '}
              <a href="#" className="text-[#0a66c2] hover:text-[#004182]">
                Cookie Policy
              </a>
              .
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full linkedin-btn-primary h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Agree & Join'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d9d9d9]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#666666]">or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-base text-[#000000]">
                Already on LinkedIn?{' '}
                <Link to="/login" className="font-medium text-[#0a66c2] hover:text-[#004182]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}