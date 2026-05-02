import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, ShieldAlert, Menu, X, Tag, Heart, Home } from 'lucide-react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const SocialIcons = () => (
  <div className="flex items-center gap-3">
    <a href="https://www.instagram.com/floral_adda_official/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#c9a84c] transition-colors">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#c9a84c] transition-colors">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#c9a84c] transition-colors">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
    </a>
  </div>
);

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('search');
    setSearchQuery(q || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    else navigate('/');
  };

  const navLink = ({ isActive }) =>
    isActive
      ? 'text-[#c9a84c] font-semibold border-b border-[#c9a84c] pb-0.5'
      : 'text-gray-700 hover:text-[#c9a84c] transition-colors';

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">

        {/* Top bar */}
        <div className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
          <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
            <span className="font-medium">🚀 Fast Delivery within 1–12 hours in the city</span>
            <SocialIcons />
          </div>
        </div>

        {/* Main row */}
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/floral-adda-final-logo.webp" alt="Floral Adda" className="h-11 w-auto object-contain" />
          </Link>

          {/* Search bar (desktop) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products.."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#c9a84c] transition-colors"
              />
            </form>
          </div>

          {/* ── Desktop icons ── */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            {!isAdmin && (
              <Link to="/categories" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#c9a84c] transition-colors" title="Categories">
                <Tag size={20} />
                <span className="text-[10px] font-semibold">Categories</span>
              </Link>
            )}
            {!isAdmin && (
              <Link to="/wishlist" className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#c9a84c] transition-colors" title="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
                <span className="text-[10px] font-semibold">Wishlist</span>
              </Link>
            )}
            {!isAdmin && (
              <Link to="/cart" className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#c9a84c] transition-colors" title="Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c9a84c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] font-semibold">Cart</span>
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#c9a84c] transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${isAdmin ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-semibold">Account</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700">
                    <ShieldAlert size={16} /> Admin
                  </Link>
                )}
                <button onClick={() => { logout(); navigate('/'); }} className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#c9a84c] transition-colors">
                <User size={20} />
                <span className="text-[10px] font-semibold">Account</span>
              </Link>
            )}
          </div>

          {/* ── Mobile: Wishlist + Cart + Hamburger ── */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            {!isAdmin && (
              <Link to="/wishlist" className="relative p-1.5 text-gray-600">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
            )}
            {!isAdmin && (
              <Link to="/cart" className="relative p-1.5 text-gray-600">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-gray-600">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block border-t border-gray-100">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-7 text-sm py-2.5 overflow-x-auto whitespace-nowrap">
              {isAdmin ? (
                <>
                  <li><NavLink to="/admin" className={navLink}><span className="flex items-center gap-1"><ShieldAlert size={14} /> Admin Dashboard</span></NavLink></li>
                  <li><NavLink to="/" className={navLink}>View Store</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/wishlist" className={navLink}>Wishlist</NavLink></li>
                  <li><NavLink to="/about" className={navLink}>About Us</NavLink></li>
                  <li><NavLink to="/faq" className={navLink}>Care Guide</NavLink></li>
                  <li><NavLink to="/returns" className={navLink}>Refund Policy</NavLink></li>
                  <li><NavLink to="/terms" className={navLink}>Terms &amp; conditions</NavLink></li>
                  <li><NavLink to="/blog" className={navLink}>Blog</NavLink></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Mobile search */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products.."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none"
            />
          </form>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-white shadow-2xl flex flex-col pt-16 px-6 overflow-y-auto">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400"><X size={22} /></button>
            <img src="/floral-adda-final-logo.webp" alt="Floral Adda" className="h-10 w-auto object-contain mb-6 self-start" />

            <ul className="flex flex-col gap-1 text-[15px] font-medium">
              {isAdmin ? (
                <>
                  <li><NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-red-600 border-b border-gray-50"><ShieldAlert size={18} /> Admin Panel</NavLink></li>
                  <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50"><Home size={18} /> Live Store</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50"><Home size={18} /> Home</NavLink></li>
                  <li><NavLink to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50"><Tag size={18} /> Categories</NavLink></li>
                  <li>
                    <NavLink to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-700 border-b border-gray-50">
                      <span className="flex items-center gap-2"><Heart size={18} /> Wishlist</span>
                      {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-700 border-b border-gray-50">
                      <span className="flex items-center gap-2"><ShoppingCart size={18} /> Cart</span>
                      {cartCount > 0 && <span className="bg-[#c9a84c] text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                    </NavLink>
                  </li>
                  <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50">About Us</NavLink></li>
                  <li><NavLink to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50">Care Guide</NavLink></li>
                  <li><NavLink to="/returns" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50">Refund Policy</NavLink></li>
                  <li><NavLink to="/terms" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700 border-b border-gray-50">Terms &amp; Conditions</NavLink></li>
                  <li><NavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-gray-700">Blog</NavLink></li>
                </>
              )}
            </ul>

            <div className="mt-auto pb-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1"><SocialIcons /></div>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 py-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs">{user.name.charAt(0).toUpperCase()}</div>
                    {user.name}
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="w-full border border-red-200 text-red-500 font-semibold py-2.5 rounded-lg text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#c9a84c] hover:bg-[#b8973d] text-white font-bold py-2.5 rounded-lg text-center text-sm transition-colors">
                  Login / Signup
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp button */}
        <a href="https://wa.me/918877803931" target="_blank" rel="noopener noreferrer"
          className="fixed z-40 bottom-20 right-4 md:bottom-6 md:right-6 bg-[#25D366] text-white p-3 md:p-3.5 rounded-full shadow-xl hover:scale-110 transition-transform border-2 border-white"
          title="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </a>
      </header>

      {/* ── Mobile Bottom Navigation Bar ── */}
      {!isAdmin && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.07)]">
          <div className="grid grid-cols-5 h-16">
            <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-gray-400'}`}>
              <Home size={20} />
              Home
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-gray-400'}`}>
              <Tag size={20} />
              Categories
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-gray-400'}`}>
              <span className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c9a84c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              Cart
            </NavLink>
            <NavLink to="/wishlist" className={({ isActive }) => `relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-gray-400'}`}>
              <span className="relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </span>
              Wishlist
            </NavLink>
            <NavLink to={user ? '/dashboard' : '/login'} className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? 'text-[#c9a84c]' : 'text-gray-400'}`}>
              {user
                ? <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[10px]">{user.name.charAt(0).toUpperCase()}</div>
                : <User size={20} />
              }
              Account
            </NavLink>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
