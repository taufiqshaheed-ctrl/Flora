import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    toggleWishlist(product);
  };

  const price = parseFloat(product.price);
  const original = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const hasDiscount = original && original > price;
  const discountPct = hasDiscount ? Math.round((original - price) / original * 100) : 0;

  const fmt = (n) => n % 1 === 0 ? n.toLocaleString('en-IN') : n.toFixed(2);

  return (
    <div className="flex flex-col bg-white">
      {/* Image container */}
      <Link to={`/product/${product._id}`} className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50 group block">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Logo watermark — top left */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <img
            src="/floral-adda-final-logo.webp"
            alt="Floral Adda"
            className="h-7 w-auto object-contain opacity-80"
          />
        </div>

        {/* Wishlist button — bottom right */}
        <button
          className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          title="Add to wishlist"
          onClick={handleWishlist}
        >
          <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3 flex flex-col gap-2">
        {/* Product name */}
        <Link to={`/product/${product._id}`} className="text-[15px] text-gray-900 font-normal leading-snug line-clamp-2 hover:text-[#c9a84c] transition-colors">
          {product.name}
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Pricing row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[17px] font-bold text-gray-900">₹{fmt(price)}</span>
          {hasDiscount && (
            <>
              <span className="text-[14px] text-gray-400 line-through">₹{fmt(original)}</span>
              <span className="text-[14px] font-semibold text-[#c9a84c]">({discountPct}% OFF)</span>
            </>
          )}
        </div>

        {/* ADD + button — left aligned, sized to content */}
        <button
          onClick={() => onAddToCart ? onAddToCart(product) : addToCart(product, 1)}
          className="mt-1 self-start flex items-center gap-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white font-semibold text-sm px-5 py-2 rounded transition-colors duration-200"
        >
          ADD <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
