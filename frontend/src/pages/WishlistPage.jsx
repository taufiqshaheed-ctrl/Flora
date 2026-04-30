import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product); // remove from wishlist after adding to cart
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Wishlist</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">My Wishlist</h1>
        {wishlist.length > 0 && (
          <p className="text-sm text-gray-400 mb-8">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
        )}

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Heart size={52} className="text-gray-200" />
            <p className="text-lg font-semibold text-gray-400">Your wishlist is empty</p>
            <Link to="/" className="mt-2 px-6 py-2.5 bg-[#c9a84c] text-white font-bold rounded-xl hover:bg-[#b8953e] transition-colors text-sm">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {wishlist.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
