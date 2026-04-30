import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShieldCheck, Award, Lock, Loader2, Copy, Check, X, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { API_BASE_URL, API_ENDPOINTS } from '../config';
import ProductCard from '../components/ProductCard';

const COUPON_CODE = 'FLAT10';
const COUPON_DISCOUNT = 0.10; // 10%

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showTnC, setShowTnC] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    setLoading(true);
    setSimilar([]);
    fetch(`${API_BASE_URL}/api/products/${productId}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    const catId = product.categoryId?._id || product.categoryId;
    if (!catId) return;
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(r => r.json())
      .then(all => {
        if (!Array.isArray(all)) return;
        const filtered = all.filter(p => {
          const pCat = p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId);
          return pCat === String(catId) && String(p._id) !== String(product._id);
        });
        setSimilar(filtered.slice(0, 6));
      })
      .catch(() => {});
  }, [product]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#c9a84c] w-10 h-10" />
    </div>
  );

  if (!product || product.error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500 text-lg">Product not found.</p>
      <button onClick={() => navigate(-1)} className="text-[#c9a84c] underline font-semibold">Go back</button>
    </div>
  );

  const price = parseFloat(product.price);
  const original = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const hasDiscount = original && original > price;
  const discountPct = hasDiscount ? Math.round((original - price) / original * 100) : 0;
  const couponPrice = Math.round(price * (1 - COUPON_DISCOUNT));
  const fmt = n => Math.round(n).toLocaleString('en-IN');

  const categoryName = product.categoryId?.name || '';
  const categorySlug = categoryName ? encodeURIComponent(categoryName) : '';

  // Single image for now; expandable when multiple images are added
  const images = [product.image_url];

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    if (!user) navigate('/login', { state: { redirectTo: '/checkout', product, quantity: 1 } });
    else navigate('/checkout', { state: { product, quantity: 1 } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-[#c9a84c] transition-colors">Categories</Link>
        {categoryName && (
          <>
            <span>/</span>
            <Link to={`/category/${categorySlug}`} className="hover:text-[#c9a84c] transition-colors uppercase">
              {categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT: Images ── */}
          <div className="flex gap-3 lg:w-[55%]">

            {/* Thumbnails strip */}
            {images.length > 0 && (
              <div className="flex flex-col gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#c9a84c]' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`view-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                title="Share"
              >
                <Share2 size={18} className="text-gray-500" />
              </button>
              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-black px-2.5 py-1 rounded-full">
                  {discountPct}% OFF
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="lg:w-[45%] flex flex-col gap-5">

            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-gray-900">₹{fmt(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{fmt(original)}</span>
                  <span className="text-base font-bold text-[#c9a84c]">({discountPct}% OFF)</span>
                </>
              )}
            </div>

            {/* Coupon box */}
            <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-green-600 text-lg mt-0.5">🏷️</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Best price: <span className="text-green-700">₹{fmt(couponPrice)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Use coupon{' '}
                    <span className="font-black text-gray-800 tracking-wider">{COUPON_CODE}</span>{' '}
                    <button onClick={handleCopy} className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1 transition-colors">
                      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy code</>}
                    </button>
                  </p>
                </div>
              </div>
              <button onClick={() => setShowTnC(true)} className="text-xs text-gray-400 shrink-0 font-medium hover:text-[#c9a84c] transition-colors">T&amp;C</button>
            </div>

            {/* Delivery info */}
            <p className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
              🕐 {product.delivery_time || 'Delivery in 2–4 hours'}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm"
              >
                {addedToCart ? '✓ Added!' : 'Add to cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#8a7339] hover:bg-[#7a6530] text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                Buy now
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (!user) { navigate('/login'); return; }
                toggleWishlist(product);
              }}
              className="flex items-center gap-2 text-sm font-medium w-fit transition-colors hover:text-red-500"
            >
              <Heart
                size={17}
                className={isWishlisted(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              />
              <span className={`underline underline-offset-2 ${isWishlisted(product._id) ? 'text-red-500' : 'text-gray-600'}`}>
                {isWishlisted(product._id) ? 'Wishlisted' : 'Add to wishlist'}
              </span>
            </button>

            {/* Trust badges */}
            <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <ShieldCheck size={20} className="text-gray-300" />
                <div className="leading-tight">
                  <p>Secure</p><p>Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <Award size={20} className="text-gray-300" />
                <div className="leading-tight">
                  <p>Satisfaction</p><p>Guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <Lock size={20} className="text-gray-300" />
                <div className="leading-tight">
                  <p>Privacy</p><p>Protected</p>
                </div>
              </div>
            </div>

            {/* Product description */}
            {product.description && (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-bold text-gray-900 text-base mb-3">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Product details */}
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-3">Product details</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {categoryName && (
                  <p><span className="text-gray-900 font-medium">Category:</span> {categoryName}</p>
                )}
                <p><span className="text-gray-900 font-medium">Delivery:</span> {product.delivery_time || '2–4 hours'}</p>
                <p><span className="text-gray-900 font-medium">Availability:</span> In Stock</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Similar products</h2>
          <hr className="border-gray-200 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {similar.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* T&C Modal */}
      {showTnC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowTnC(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setShowTnC(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-5">Coupon Terms &amp; Conditions</h2>

            {/* Coupon badge row */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500">
                <Tag size={18} className="text-white" />
              </span>
              <span className="text-base font-bold text-gray-900 tracking-wide">{COUPON_CODE}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-4">
              Get <span className="font-semibold">10% off</span> on your order.{' '}
              <span className="underline">Applicable on all products</span>. Applicable on both online and COD.
            </p>

            {/* Details */}
            <p className="text-sm text-gray-400 font-medium mb-2">Details</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 text-sm text-gray-600">
              <li>Applicable on both online and COD</li>
              <li>Applicable only 5 times per customer</li>
              <li>Discount is applied at checkout</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
