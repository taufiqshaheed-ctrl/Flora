import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Fetch the newly logged in user from localStorage to check role
      const loggedInUser = JSON.parse(localStorage.getItem('flora_user'));
      
      if (loggedInUser.role !== 'admin') {
        setError('Access Denied. This area is reserved for administrators.');
        logout(); // Logout non-admin users from admin portal
        setLoading(false);
        return;
      }

      setLoading(false);
      if (location.state && location.state.redirectTo) {
        navigate(location.state.redirectTo, { state: location.state });
      } else {
        navigate('/admin');
      }
    } else {
      setLoading(false);
      setError(result.error || 'Invalid administrator credentials.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-800">
        <div className="bg-gray-800 py-8 px-8 text-center border-b border-gray-700">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <ShieldAlert size={32} className="text-[#fbbf24]" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 font-medium mt-2">Restricted Access. Authorized Personnel Only.</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center text-balance">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
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
                  placeholder="admin@ecommerce.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" state={{ from: '/admin-login' }} className="text-xs font-semibold text-gray-900 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Login'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

