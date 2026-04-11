import React from 'react';
import { Clock, ShoppingCart } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth(); // Auth Check added

  const handleBuyNow = () => {
    if (!user) {
      // Intentionally passing the state so Login page can redirect back here / to checkout
      navigate('/login', { state: { redirectTo: '/checkout', product, quantity: 1 } });
    } else {
      navigate('/checkout', { state: { product, quantity: 1 } });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Product Image */}
      <div className="w-full aspect-[4/5] bg-gray-100 relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Product Title */}
        <h3 className="font-bold text-[18px] text-gray-900 leading-tight premium-serif">
          {product.name}
        </h3>


        {/* Delivery Info */}
        <div className="flex items-center gap-1.5 text-[#059669]">
          <Clock size={16} strokeWidth={2.5} />
          <span className="text-[15px] font-medium tracking-wide">
            Delivery in 2-4 hours
          </span>
        </div>

        {/* Price and Cart Row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Price */}
          <div className="text-[22px] font-bold text-gray-900">
            ₹{product.price.toString().replace(/\.00$/, '')}
          </div>

          <div className="flex items-center gap-3">
            {/* Add to Cart Icon Button */}
            <button 
              onClick={() => addToCart(product, 1)}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* Buy Now Button */}
        <button 
          onClick={handleBuyNow}
          className="w-full bg-[#059669] hover:bg-[#047857] text-white font-medium text-lg py-2.5 rounded-lg mt-1 transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};


export default ProductCard;
