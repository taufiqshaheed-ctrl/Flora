import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, MapPin, Zap, ShieldAlert, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
    else setSearchQuery('');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="w-full bg-white relative z-50">
      {/* Top Notice Bar */}
      <div className="bg-[#fbbf24] text-black text-xs font-semibold">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center bg-[#fbbf24]">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1 shrink-0 whitespace-nowrap">
              <MapPin size={12} className="text-red-600" /> <span className="hidden xs:inline">Worldwide</span> Delivery
            </span>
            <span className="text-black/20 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 shrink-0 whitespace-nowrap hidden sm:flex">
              <Zap size={12} className="text-white" /> Same Day Delivery Available
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link to="/contact" className="hover:underline whitespace-nowrap">Help</Link>
            <Link to="/contact" className="hover:underline whitespace-nowrap">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="bg-[#fbbf24] px-4 py-1.5 rounded-md font-black text-xl tracking-wide text-black shadow-sm">
            Flora
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-[#fbbf24] transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearch} className="relative border border-gray-300 rounded-md overflow-hidden bg-white">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-400 hover:text-[#fbbf24] transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-800 hover:text-[#fbbf24] transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold hidden lg:block">Hi, {user.name}</span>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }} 
                className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-[#fbbf24] transition-colors" title="Login / Register">
              <User size={24} />
            </Link>
          )}

          <div className="flex items-center gap-4">
            {(!user || user.role !== 'admin') && (
              <Link to="/cart">
                <button className="text-gray-700 hover:text-[#fbbf24] transition-colors relative">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#fbbf24] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Desktop Navigation Menu */}
      <div className="container mx-auto px-4 pb-3 border-b border-gray-100 hidden md:block">
        <ul className="flex items-center gap-6 text-[15px] font-medium overflow-x-auto whitespace-nowrap">
          {user && user.role === 'admin' ? (
            <>
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-red-600 font-bold border-b-2 border-red-600 pb-3 flex items-center gap-2' : 'text-gray-800 hover:text-red-600 pb-3 transition-colors flex items-center gap-2'}>
                  <ShieldAlert size={18} /> Admin Dashboard
                </NavLink>
              </li>
              <li><NavLink to="/" className="text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors">View Live Store</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/" className={({ isActive }) => isActive && window.location.pathname === '/' ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>Home</NavLink></li>
              <li><NavLink to="/delivery" className={({ isActive }) => isActive ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>Delivery</NavLink></li>
              <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>Contact</NavLink></li>
              <li><NavLink to="/payment-delivery" className={({ isActive }) => isActive ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>Payments</NavLink></li>
              <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>Blog</NavLink></li>
              <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-[#ff5e00] font-bold border-b-2 border-[#ff5e00] pb-3' : 'text-gray-800 hover:text-[#ff5e00] pb-3 transition-colors'}>My Account</NavLink></li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-72 h-full bg-white shadow-2xl flex flex-col pt-20 px-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-gray-500"><X size={24} /></button>
          <h2 className="text-xl font-black mb-8 border-b pb-4 text-black">Menu</h2>
          <ul className="flex flex-col gap-5 text-lg font-bold">
            {user && user.role === 'admin' ? (
              <>
                <li><NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 flex items-center gap-2"><ShieldAlert size={20} /> Admin Panel</NavLink></li>
                <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Live Store</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Home</NavLink></li>
                <li><NavLink to="/delivery" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Delivery</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Contact</NavLink></li>
                <li><NavLink to="/payment-delivery" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Payments</NavLink></li>
                <li><NavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">Blog</NavLink></li>
                <li><NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800">My Account</NavLink></li>
              </>
            )}
          </ul>
          <div className="mt-auto pb-10 flex flex-col gap-4">
             {user ? (
               <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-lg border border-red-100">Logout</button>
             ) : (
               <>
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#fbbf24] text-black font-bold py-3 rounded-lg text-center shadow-sm">Login / Signup</Link>
               </>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-4 md:hidden">
        <form onSubmit={handleSearch} className="relative border border-gray-300 rounded-md overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-400 hover:text-[#fbbf24] transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* WhatsApp Icon */}
      <a href="https://wa.me/918877803931" target="_blank" rel="noopener noreferrer" className="fixed z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform floating-whatsapp border-2 border-white" title="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </header>
  );
};

export default Header;


