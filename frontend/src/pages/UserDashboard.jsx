import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShoppingBag, MapPin, LogOut, ChevronRight, Settings, ShieldCheck } from 'lucide-react';
import Profile from './Profile';
import Orders from './Orders';
import AddressBook from './AddressBook';

/**
 * UserDashboard Component
 * A premium, tabbed dashboard for managing all user account activities.
 */
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'addresses'

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'orders', label: 'Order History', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'addresses', label: 'Address Book', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <Profile />;
      case 'orders': return <Orders />;
      case 'addresses': return <AddressBook />;
      default: return <Profile />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              {/* User Header */}
              <div className="p-8 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black mb-4">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <h2 className="text-xl font-black truncate">{user?.name}</h2>
                  <p className="text-gray-400 text-sm font-medium truncate">{user?.email}</p>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                      activeTab === item.id 
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/10' : item.bg}`}>
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : item.color} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${activeTab === item.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-50">
                   <button
                     onClick={logout}
                     className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                   >
                     <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-red-100/50">
                           <LogOut size={20} />
                        </div>
                        <span>Sign Out</span>
                     </div>
                   </button>
                </div>
              </nav>

              {/* Footer / Badge */}
              <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-green-500" />
                    Verified Secure Account
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
