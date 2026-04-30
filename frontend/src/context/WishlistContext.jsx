import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const getToken = () => localStorage.getItem('flora_token');

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]); // array of product objects

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const res = await fetch(API_ENDPOINTS.WISHLIST, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const isWishlisted = (productId) => wishlist.some(p => String(p._id) === String(productId));

  const toggleWishlist = async (product) => {
    if (!user) return false; // caller should redirect to login
    const id = product._id;
    const alreadyIn = isWishlisted(id);
    // Optimistic update
    setWishlist(prev =>
      alreadyIn ? prev.filter(p => String(p._id) !== String(id)) : [...prev, product]
    );
    try {
      const method = alreadyIn ? 'DELETE' : 'POST';
      await fetch(`${API_BASE_URL}/api/wishlist/${id}`, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {
      // Revert on failure
      fetchWishlist();
    }
    return !alreadyIn; // returns new state (true = added)
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
