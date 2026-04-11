import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Lock, Edit3, Loader2, Save, X, KeyRound } from 'lucide-react';

/**
 * Profile Component
 * Manages personal information and password security.
 */
const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name, email: user?.email });
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const res = await updateProfile(profileData.name, profileData.email);
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: res.error || 'Update failed' });
    }
    setProfileLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: "New passwords don't match!" });
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Password change failed' });
    }
    setPasswordLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Toast Message */}
      {message.text && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-8 duration-300 ${
          message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          <div className="flex items-center gap-3 font-bold text-sm">
             <ShieldCheck size={20} />
             {message.text}
          </div>
        </div>
      )}

      {/* Profile Info Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-balance">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">Personal Information</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Manage your identity and contact details.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm font-black text-gray-900 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="p-8">
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative group">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#fbbf24] transition-colors" />
                  <input 
                    type="text" disabled={!isEditing} 
                    value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 pl-12 outline-none focus:border-[#fbbf24] transition-all disabled:opacity-75 disabled:bg-gray-50 font-bold text-gray-900"
                  />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#fbbf24] transition-colors" />
                  <input 
                    type="email" disabled={!isEditing} 
                    value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 pl-12 outline-none focus:border-[#fbbf24] transition-all disabled:opacity-75 disabled:bg-gray-50 font-bold text-gray-900"
                  />
                </div>
             </div>

             {isEditing && (
               <div className="md:col-span-2 flex gap-4 pt-4">
                  <button 
                    type="submit" disabled={profileLoading}
                    className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {profileLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                  </button>
                  <button 
                    type="button" onClick={() => { setIsEditing(false); setProfileData({ name: user?.name, email: user?.email }); }}
                    className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={20} /> Cancel
                  </button>
               </div>
             )}
          </form>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-balance">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">Security Settings</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Keep your account secure with a strong password.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl">
             <ShieldCheck size={24} className="text-green-500" />
          </div>
        </div>

        <div className="p-8">
          {!isChangingPassword ? (
             <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                      <Lock size={24} />
                   </div>
                   <div>
                      <p className="font-black text-gray-900 leading-tight">Password Management</p>
                      <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">Last updated: Recently</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full sm:w-auto bg-white border border-gray-200 text-gray-900 font-black px-8 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  Change Password
                </button>
             </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl animate-in zoom-in-95 duration-300">
               <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Current Password</label>
                     <div className="relative group">
                        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                           type="password" required value={passwordData.currentPassword} 
                           onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                           className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 pl-12 outline-none focus:border-red-500 transition-all font-bold"
                           placeholder="••••••••"
                        />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                        <input 
                           type="password" required value={passwordData.newPassword} 
                           onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                           className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-green-500 transition-all font-bold"
                           placeholder="••••••••"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                        <input 
                           type="password" required value={passwordData.confirmPassword} 
                           onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                           className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-green-500 transition-all font-bold"
                           placeholder="••••••••"
                        />
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    type="submit" disabled={passwordLoading}
                    className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                  </button>
                  <button 
                    type="button" onClick={() => setIsChangingPassword(false)}
                    className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl"
                  >
                    Cancel
                  </button>
               </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
