import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const from = location.state?.from || '/login';
  const isAdminPath = from === '/admin-login';

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.error || 'Failed to send OTP. Try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email, code, newPassword);
    setLoading(false);
    if (result.success) {
      navigate(from, { state: { resetSuccess: true } });
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const accent = isAdminPath ? 'bg-gray-800' : 'bg-[#fbbf24]';
  const btnClass = isAdminPath
    ? 'bg-gray-900 hover:bg-black text-white'
    : 'bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900';
  const headingColor = isAdminPath ? 'text-white' : 'text-gray-900';
  const subColor = isAdminPath ? 'text-gray-400' : 'text-gray-800';

  if (step === 'otp') {
    return (
      <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`${accent} py-8 px-8 text-center relative`}>
            <button
              onClick={() => setStep('email')}
              className={`absolute left-6 top-1/2 -translate-y-1/2 ${isAdminPath ? 'text-[#fbbf24]' : 'text-gray-900'} hover:scale-110 transition-transform`}
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className={`text-3xl font-black ${headingColor} tracking-tight`}>Enter OTP</h2>
            <p className={`${subColor} font-medium mt-2`}>OTP sent to {email}</p>
          </div>
          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">6-Digit OTP</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-2xl font-black border-2 border-gray-200 rounded-xl outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all bg-gray-50"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">OTP expires in 10 minutes</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${btnClass} font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 shadow-lg`}
              >
                {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`${accent} py-8 px-8 text-center relative`}>
          <Link
            to={from}
            className={`absolute left-6 top-1/2 -translate-y-1/2 ${isAdminPath ? 'text-[#fbbf24]' : 'text-gray-900'} hover:scale-110 transition-transform`}
          >
            <ArrowLeft size={24} />
          </Link>
          <h2 className={`text-3xl font-black ${headingColor} tracking-tight`}>Reset Password</h2>
          <p className={`${subColor} font-medium mt-2`}>We'll send an OTP to your email</p>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${btnClass} font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 mt-4 shadow-lg`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'} <ArrowRight size={18} />
            </button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            Wait, I remember it!{' '}
            <Link to={from} className={`${isAdminPath ? 'text-gray-900' : 'text-[#ff5e00]'} font-bold hover:underline`}>
              Back to {isAdminPath ? 'Admin Login' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
