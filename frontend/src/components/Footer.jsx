import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">

      {/* Trust strip */}
      <div className="bg-[#f9f5ee] border-b border-[#e8dfc8] py-6">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🚀</span>
            <p className="font-bold text-gray-800 text-sm">Fast Delivery</p>
            <p className="text-xs text-gray-500">Within 1–12 hours in the city</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🔒</span>
            <p className="font-bold text-gray-800 text-sm">Secure Payment</p>
            <p className="text-xs text-gray-500">All major payment methods accepted</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🌸</span>
            <p className="font-bold text-gray-800 text-sm">Premium Quality</p>
            <p className="text-xs text-gray-500">Fresh & verified products</p>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <img src="/floral-adda-final-logo.webp" alt="Floral Adda" className="h-12 w-auto object-contain self-start" />
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium party gifts, flowers & hampers delivered fresh to your door.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-1">
              <a href="https://www.instagram.com/floral_adda_official/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#c9a84c] transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#c9a84c] transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#c9a84c] transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
              </a>
              <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#c9a84c] transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-[#c9a84c] transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-[#c9a84c] transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Policies</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li><Link to="/delivery" className="hover:text-[#c9a84c] transition-colors">Delivery Info</Link></li>
              <li><Link to="/returns" className="hover:text-[#c9a84c] transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-[#c9a84c] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#c9a84c] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/faq" className="hover:text-[#c9a84c] transition-colors">Care Guide / FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#c9a84c] shrink-0" />
                <span>+91 8877803931</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#c9a84c] shrink-0" />
                <span>floraladdaofficial@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#c9a84c] shrink-0 mt-0.5" />
                <span>Gokul floral, Near SBI ATM, Bajla chowk, Deoghar, Jharkhand 814112</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© 2026 Floral Adda. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-[#c9a84c] transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-[#c9a84c] transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/returns" className="hover:text-[#c9a84c] transition-colors">Refund</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
