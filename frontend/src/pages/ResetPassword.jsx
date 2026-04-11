import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ loading: false, error: 'Passwords do not match!', success: false });
    }
    setStatus({ loading: true, error: '', success: false });
    const result = await resetPassword(token, formData.newPassword);
    if (result.success) {
      setStatus({ loading: false, error: '', success: true });
    } else {
      setStatus({ loading: false, error: result.error || 'Reset failed. The link may have expired.', success: false });
    }
  };

  if (!token) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Invalid Link</h2>
          <p className="text-gray-500 mb-8">This reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="w-full bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900 font-bold py-4 rounded-xl block transition-all text-center">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (status.success) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Password Updated!</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Your password has been reset successfully. You can now log in with your new credentials.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900 font-bold py-4 rounded-xl transition-all text-center"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#fbbf24] py-8 px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Set New Password</h2>
          <p className="text-gray-800 font-medium mt-2">Choose a strong new password</p>
        </div>

        <div className="p-8">
          {status.error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900 font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 mt-4 shadow-lg shadow-yellow-100"
            >
              {status.loading ? 'Updating...' : 'Update Password'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
