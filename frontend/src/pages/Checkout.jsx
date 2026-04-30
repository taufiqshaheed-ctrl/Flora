import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, MapPin, Plus, ChevronRight, X } from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
// import UpiPaymentModal from '../components/UpiPaymentModal';


const getToken = () => localStorage.getItem('flora_token');

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  
  const [paymentMethod] = useState('cod');
  
  // Extract state passed from router (moved up for scope consistency)
  const { product, quantity, cartCheckout } = location.state || {};

  // Derive items and totals based on the mode (moved up for scope consistency)
  const isCartMode = cartCheckout && cartItems.length > 0;
  const isSingleMode = !!product;
  const itemsToRender = isCartMode ? cartItems : [{ product, quantity: quantity || 1 }];
  
  const subtotal = isCartMode 
    ? cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    : (product?.price || 0) * (quantity || 1);
    
  const total = subtotal; // Free delivery


  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [formError, setFormError] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | 'checking' | 'ok' | 'invalid'
  const [pincodeArea, setPincodeArea] = useState('');
  
  // Address Selection State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES}/${user.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setSavedAddresses(data);
      
      // Auto-select default address if available
      const def = data.find(a => a.isDefault);
      if (def) selectAddress(def);
    } catch (err) {
      console.error('Failed to fetch addresses');
    }
  };

  const selectAddress = (addr) => {
    setFormData({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode
    });
    setShowAddressPicker(false);
  };

  
  const checkPincode = async (code) => {
    if (!code || code.trim().length < 4) { setPincodeStatus(null); setPincodeArea(''); return; }
    setPincodeStatus('checking');
    try {
      const res = await fetch(`${API_BASE_URL}/api/pincodes/check/${code.trim()}`);
      const data = await res.json();
      setPincodeStatus(data.deliverable ? 'ok' : 'invalid');
      setPincodeArea(data.area || '');
    } catch {
      setPincodeStatus(null);
    }
  };

  const handlePayment = async () => {
    console.log('--- Checkout: Starting payment process ---');
    if (!user) {
      console.log('User not logged in, redirecting to login');
      navigate('/login', { state: { redirectTo: location.pathname, ...location.state } });
      return;
    }

    // Individual field validation for better UX
    if (!formData.name?.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.phone?.trim()) {
      setFormError('Please enter your mobile number.');
      return;
    }
    if (formData.phone.trim().length !== 10) {
      setFormError('Mobile number must be exactly 10 digits.');
      return;
    }
    if (!formData.address?.trim()) {
      setFormError('Please enter your delivery address.');
      return;
    }
    if (!formData.city?.trim()) {
      setFormError('Please enter your city.');
      return;
    }
    if (!formData.pincode?.trim()) {
      setFormError('Please enter your PIN code.');
      return;
    }
    if (pincodeStatus === 'invalid') {
      setFormError("Sorry, we don't deliver to this pincode. Please try a different address.");
      return;
    }
    if (pincodeStatus === 'checking' || pincodeStatus === null) {
      // check synchronously before proceeding
      try {
        const res = await fetch(`${API_BASE_URL}/api/pincodes/check/${formData.pincode.trim()}`);
        const data = await res.json();
        if (!data.deliverable) {
          setFormError("Sorry, we don't deliver to this pincode. Please try a different address.");
          setPincodeStatus('invalid');
          return;
        }
        setPincodeStatus('ok');
        setPincodeArea(data.area || '');
      } catch { /* allow if API fails */ }
    }

    setFormError('');
    console.log('Validation passed, completing order...');
    completeOrder();
  };

  const completeOrder = async () => {
    setIsProcessing(true);
    const methodStr = 'Cash on Delivery';
    
    const shippingAddress = {
      ...formData,
      countryCode
    };

    console.log('Placing order with payload:', { items: itemsToRender, method: methodStr, total, address: shippingAddress });
    
    try {
      const result = await placeOrder(itemsToRender, methodStr, total, shippingAddress);
      console.log('Place order result:', result);

      if (result.success) {
        if (isCartMode) {
          clearCart();
        }
        setIsProcessing(false);
        setIsSuccess(true);
      } else {
        setIsProcessing(false);
        setFormError(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setFormError('An unexpected error occurred. Please check your connection.');
    }
  };

  
  // SUCCESS VIEW (Checked FIRST to avoid empty cart guard)
  if (isSuccess) {
    return (
      <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle size={40} className="text-[#059669]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Order Successful!</h2>
          <p className="text-gray-500 mb-8">Your order has been placed securely and will be delivered straight to you.</p>
          <div className="flex gap-4 max-w-sm mx-auto">
            <Link to="/orders" className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-3.5 rounded-lg transition-colors inline-block whitespace-nowrap">
              Track Order
            </Link>
            <Link to="/" className="w-full bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-black font-bold py-3.5 rounded-lg transition-colors inline-block">
              Shop More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE GUARD (Checked second)
  if (!isCartMode && !isSingleMode) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">No particular items selected for checkout.</h2>
        <Link to="/" className="text-[#fbbf24] hover:underline font-bold">Return to Shop</Link>
      </div>
    );
  }



  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium">
          <ArrowLeft size={18} /> Back directly
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Forms */}
          <div className="flex-1 space-y-8">
            
            {/* Delivery Details */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                   <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
                   Delivery Details
                 </h2>
                 {user && savedAddresses.length > 0 && (
                   <button 
                     onClick={() => setShowAddressPicker(!showAddressPicker)}
                     className="text-xs font-black text-[#fbbf24] hover:text-[#f59e0b] uppercase tracking-widest flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 transition-all active:scale-95"
                   >
                     <MapPin size={14} /> Quick Select Address
                   </button>
                 )}
              </div>

              {/* Address Picker Dropdown */}
              {showAddressPicker && (
                <div className="absolute top-20 right-8 z-30 w-full max-w-sm bg-white border-2 border-[#fbbf24] shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900">Your Saved Addresses</span>
                      <button onClick={() => setShowAddressPicker(false)} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                      {savedAddresses.map(addr => (
                         <button 
                           key={addr.id} 
                           onClick={() => selectAddress(addr)}
                           className="w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group flex items-center justify-between"
                         >
                            <div className="flex-1">
                               <p className="font-black text-gray-900 text-sm">{addr.name}</p>
                               <p className="text-xs text-gray-500 font-bold truncate pr-4">{addr.address}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#fbbf24] transition-all" />
                         </button>
                      ))}
                   </div>
                   <Link to="/dashboard" className="block text-center p-3 text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white hover:bg-black transition-colors">
                      <Plus size={12} className="inline mr-1" /> Add New Address
                   </Link>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#fbbf24] outline-none" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border border-gray-300 border-r-0 rounded-l-md p-2.5 bg-gray-50 focus:ring-2 focus:ring-[#fbbf24] outline-none text-sm text-gray-700 cursor-pointer"
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+971">UAE (+971)</option>
                    </select>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // Remove non-numeric
                        if (val.length <= 10) setFormData({...formData, phone: val});
                      }}
                      className="w-full border border-gray-300 rounded-r-md p-2.5 focus:ring-2 focus:ring-[#fbbf24] outline-none" 
                      placeholder="9876543210" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
                  <textarea 
                    rows="3" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#fbbf24] outline-none resize-none" 
                    placeholder="Flat, House no., Building, Company, Apartment"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#fbbf24] outline-none" 
                    placeholder="Mumbai" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.pincode}
                    maxLength={6}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, pincode: val});
                      setPincodeStatus(null);
                      setPincodeArea('');
                    }}
                    onBlur={(e) => checkPincode(e.target.value)}
                    className={`w-full border rounded-md p-2.5 focus:ring-2 outline-none transition-colors ${
                      pincodeStatus === 'ok'      ? 'border-green-400 focus:ring-green-200' :
                      pincodeStatus === 'invalid' ? 'border-red-400 focus:ring-red-200' :
                                                    'border-gray-300 focus:ring-[#fbbf24]'
                    }`}
                    placeholder="e.g. 342001"
                  />
                  {pincodeStatus === 'checking' && (
                    <p className="text-xs text-gray-400 mt-1">Checking delivery availability…</p>
                  )}
                  {pincodeStatus === 'ok' && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      ✓ Delivery available{pincodeArea ? ` — ${pincodeArea}` : ''}
                    </p>
                  )}
                  {pincodeStatus === 'invalid' && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      ✕ Sorry, we don't deliver to this pincode.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Options - Only COD available */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* Cash on Delivery Option (Fixed as only choice) */}
                <div className="flex items-center gap-3 p-5 border-2 border-[#fbbf24] bg-yellow-50 rounded-xl">
                  <div className="w-5 h-5 bg-[#fbbf24] rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-black text-gray-900 block">Cash on Delivery</span>
                    <span className="text-xs text-gray-500 font-bold">Pay in cash when your order is delivered to your doorstep.</span>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 mb-6 border-b border-gray-100 pb-2 space-y-4">
                {itemsToRender.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900 mt-0.5">₹{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-gray-700 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-black text-gray-900 mb-8">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold mb-4 border border-red-100 flex items-start gap-2">
                  <ShieldCheck size={18} className="shrink-0 mt-0.5" /> 
                  <p>{formError}</p>
                </div>
              )}

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-lg py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm disabled:opacity-75"
              >
                {isProcessing ? 'Processing Order...' : `Place Order (COD)`}
                {!isProcessing && <CheckCircle size={20} />}
              </button>


              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-green-600" /> Guaranteed Safe & Secure Checkout
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Removed UpiPaymentModal */}
    </div>

  );
};

export default Checkout;

