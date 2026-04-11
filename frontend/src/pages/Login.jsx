import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      const loggedInUser = JSON.parse(localStorage.getItem('flora_user'));
      if (loggedInUser?.role === 'admin') {
        navigate('/admin');
      } else if (location.state && location.state.redirectTo) {
        navigate(location.state.redirectTo, { state: location.state });
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#fbbf24] py-8 px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-800 font-medium mt-2">Sign in to your Flora account</p>
        </div>
        
        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" size={14} className="text-xs font-semibold text-[#ff5e00] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-600 border-t border-gray-100 pt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#ff5e00] font-bold hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

