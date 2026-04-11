import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to the cart yet.</p>
          <Link to="/" className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-3.5 rounded-lg transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/checkout', cartCheckout: true, subtotal } });
    } else {
      navigate('/checkout', { state: { cartCheckout: true, subtotal } });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <span className="text-gray-500 font-medium">{cartItems.length} Items</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Cart Items List */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative">
                
                {/* Product Image */}
                <img 
                  src={item.product.image_url} 
                  alt={item.product.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-100 shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0 pr-10 sm:pr-0">
                  <h3 className="font-bold text-lg text-gray-900 leading-snug mb-1 truncate">{item.product.name}</h3>
                  <p className="text-[#059669] text-sm font-medium mb-4">{item.product.delivery_time}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-black text-xl text-gray-900">₹{item.product.price}</span>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-full h-9 px-1 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 rounded-l-full transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold select-none">
                        {item.quantity}
                      </span>
                      <button 
                         onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 rounded-r-full transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Remove Item"
                >
                  <Trash2 size={20} />
                </button>

              </div>
            ))}
            
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#fbbf24] font-semibold mt-4">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[380px]">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 text-gray-700 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-red-500 font-medium">- ₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-sm">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-400">Inclusive of VAT</div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold text-lg py-3.5 rounded-lg transition-colors shadow-sm"
              >
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6 bg-gray-50 py-2 rounded-md">
                <ShieldCheck size={16} className="text-green-600" />
                <span>Safe and Secure Payments</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
