import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { login: _login } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token found in the link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.VERIFY_EMAIL}/${token}`);
        const data = await res.json();
        if (res.ok) {
          // Auto-login after verification
          localStorage.setItem('flora_user', JSON.stringify(data.user));
          localStorage.setItem('flora_token', data.token);
          setStatus('success');
          setTimeout(() => navigate('/'), 2500);
        } else {
          setStatus('error');
          setErrorMsg(data.error || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setErrorMsg('Connection error. Please try again.');
      }
    };

    verify();
  }, [token, navigate]);

  if (status === 'verifying') {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader size={48} className="text-[#fbbf24] animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Verifying your email...</h2>
          <p className="text-gray-500">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-500 mb-6 font-medium">
            Your account is now active. Redirecting you to the store...
          </p>
          <div className="w-8 h-8 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10 text-center border border-red-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Failed</h2>
        <p className="text-gray-500 mb-8">{errorMsg}</p>
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-[#fbbf24] hover:bg-[#f5b000] text-gray-900 font-bold py-4 rounded-xl transition-all"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
