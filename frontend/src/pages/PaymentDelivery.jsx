import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Banknote, Smartphone, Wallet } from 'lucide-react';

const PaymentDelivery = () => {
  const [activeTab, setActiveTab] = useState('cards');

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#fbbf24] py-16 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Options</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          We accept all secure payment methods for a seamless checkout experience.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16">
        
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">100% Secure Payments</h2>
            <p className="text-gray-600">
              Your security is our priority. We use industry-standard 256-bit SSL encryption to protect your personal and payment details. We don't store your credit card data on our servers.
            </p>
            <div className="flex gap-4">
              <ShieldCheck size={40} className="text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={() => setActiveTab('cards')}
              className={`p-6 rounded-xl shadow-sm border flex flex-col items-center gap-3 transition-all outline-none ${activeTab === 'cards' ? 'border-[#fbbf24] bg-white ring-2 ring-[#fbbf24] scale-105' : 'border-gray-100 bg-white hover:border-[#fbbf24] hover:shadow-md'}`}
            >
              <CreditCard size={32} className="text-blue-600" />
              <span className="font-semibold text-gray-800">Cards</span>
            </button>

            <button 
              onClick={() => setActiveTab('upi')}
              className={`p-6 rounded-xl shadow-sm border flex flex-col items-center gap-3 transition-all outline-none ${activeTab === 'upi' ? 'border-[#fbbf24] bg-white ring-2 ring-[#fbbf24] scale-105' : 'border-gray-100 bg-white hover:border-[#fbbf24] hover:shadow-md'}`}
            >
              <Smartphone size={32} className="text-purple-600" />
              <span className="font-semibold text-gray-800">UPI / Apps</span>
            </button>

            <button 
              onClick={() => setActiveTab('wallets')}
              className={`p-6 rounded-xl shadow-sm border flex flex-col items-center gap-3 transition-all outline-none ${activeTab === 'wallets' ? 'border-[#fbbf24] bg-white ring-2 ring-[#fbbf24] scale-105' : 'border-gray-100 bg-white hover:border-[#fbbf24] hover:shadow-md'}`}
            >
              <Wallet size={32} className="text-orange-600" />
              <span className="font-semibold text-gray-800">Wallets</span>
            </button>

            <button 
              onClick={() => setActiveTab('cod')}
              className={`p-6 rounded-xl shadow-sm border flex flex-col items-center gap-3 transition-all outline-none ${activeTab === 'cod' ? 'border-[#fbbf24] bg-white ring-2 ring-[#fbbf24] scale-105' : 'border-gray-100 bg-white hover:border-[#fbbf24] hover:shadow-md'}`}
            >
              <Banknote size={32} className="text-green-600" />
              <span className="font-semibold text-gray-800">COD</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Area based on Tabs */}
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 min-h-[250px] transition-all relative overflow-hidden">
          
          {activeTab === 'cards' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold mb-4 border-b pb-4 flex items-center gap-3 text-blue-800">
                <CreditCard size={28} /> Credit & Debit Cards
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                We accept all major cards including <strong>Visa, Mastercard, American Express, and RuPay</strong>. For international deliveries or high-value orders, your bank might require you to authenticate your transaction using a One Time Password (OTP).
              </p>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="bg-gray-100 px-5 py-2 font-black text-gray-600 tracking-wider rounded-lg text-sm italic">VISA</div>
                <div className="bg-gray-100 px-5 py-2 font-black text-gray-600 tracking-wider rounded-lg text-sm italic">Mastercard</div>
                <div className="bg-gray-100 px-5 py-2 font-black text-gray-600 tracking-wider rounded-lg text-sm italic">RuPay</div>
                <div className="bg-gray-100 px-5 py-2 font-black text-gray-600 tracking-wider rounded-lg text-sm">AMEX</div>
              </div>
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold mb-4 border-b pb-4 flex items-center gap-3 text-purple-800">
                <Smartphone size={28} /> UPI & Payment Apps
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Pay quickly and securely using your favorite UPI apps. Just enter your UPI ID (VPA) or scan the QR code generated at the checkout stage.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 uppercase tracking-widest text-xs">GPay</div>
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 uppercase tracking-widest text-xs">PhonePe</div>
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 uppercase tracking-widest text-xs">Paytm</div>
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 uppercase tracking-widest text-xs">Amazon Pay</div>
              </div>
            </div>
          )}

          {activeTab === 'wallets' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold mb-4 border-b pb-4 flex items-center gap-3 text-orange-800">
                <Wallet size={28} /> Digital Wallets
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Store money digitally and check out with single-click convenience. We support all major Indian wallets for seamless transaction flows without banking interruptions.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 tracking-widest text-xs">MobiKwik</div>
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 tracking-widest text-xs">Freecharge</div>
                <div className="border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-700 bg-gray-50 tracking-widest text-xs uppercase">Cred Pay</div>
              </div>
            </div>
          )}

          {activeTab === 'cod' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold mb-4 border-b pb-4 flex items-center gap-3 text-green-800">
                <Banknote size={28} /> Cash on Delivery (COD)
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Prefer to pay when your package arrives? Cash on Delivery is available for orders under <strong>₹5,000</strong> across 16,000+ PIN codes in India. 
              </p>
              <div className="bg-yellow-50 p-6 border-l-4 border-yellow-400 rounded-r-lg shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><ShieldCheck size={18} className="text-yellow-600"/> Important Notice:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Personalized items (like custom named cakes, engraved jewelry, or photo mugs) require 100% pre-payment upfront and are <strong>NOT</strong> eligible for Cash on Delivery.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentDelivery;
