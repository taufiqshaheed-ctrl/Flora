import React from 'react';
import { Truck, Clock, Moon, MapPin } from 'lucide-react';

const Delivery = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-[#fbbf24] py-16 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Delivery Information</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Fast, reliable, and careful delivery to make your celebrations perfect.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Delivery Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_40px_rgba(153,27,27,0.6)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/5 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-red-800/70 rounded-xl transition-all duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(153,27,27,0)] group-hover:shadow-[inset_0_0_40px_rgba(153,27,27,0.4)]"></div>

            <div className="bg-orange-100 p-4 rounded-full mb-4 text-[#ff5e00] relative z-10 group-hover:bg-red-100 group-hover:text-red-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Truck size={32} className="group-hover:animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-900 transition-all duration-500 group-hover:font-serif group-hover:tracking-[0.2em] relative z-10">Standard Delivery</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors duration-300 relative z-10">
              Free delivery for orders over ₹999. Usually delivered within 1-2 business days across all supported pin codes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_40px_rgba(153,27,27,0.6)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/5 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-red-800/70 rounded-xl transition-all duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(153,27,27,0)] group-hover:shadow-[inset_0_0_40px_rgba(153,27,27,0.4)]"></div>

            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600 relative z-10 group-hover:bg-red-100 group-hover:text-red-700 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
              <Clock size={32} className="group-hover:animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-900 transition-all duration-500 group-hover:font-serif group-hover:tracking-[0.2em] relative z-10">Same-Day Delivery</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors duration-300 relative z-10">
              Need it urgent? Place order before 4 PM for guaranteed same-day delivery in select metropolitan areas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_40px_rgba(153,27,27,0.6)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/5 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-red-800/70 rounded-xl transition-all duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(153,27,27,0)] group-hover:shadow-[inset_0_0_40px_rgba(153,27,27,0.4)]"></div>

            <div className="bg-purple-100 p-4 rounded-full mb-4 text-purple-600 relative z-10 group-hover:bg-red-100 group-hover:text-red-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
              <Moon size={32} className="group-hover:animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-900 transition-all duration-500 group-hover:font-serif group-hover:tracking-[0.2em] relative z-10">Midnight Delivery</h3>
            <p className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors duration-300 relative z-10">
              Surprise them exactly at midnight start! Special customized midnight cake & bouquet delivery (Extra charges apply).
            </p>
          </div>

        </div>

        {/* Coverage Area Area */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Coverage Areas</h2>
            <p className="text-gray-600 mb-6">
              We currently cover all major cities in India. For fresh items like cakes and natural flower bouquets, we fulfill orders locally to ensure maximum freshness.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-gray-700">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Mumbai</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Delhi NCR</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Bangalore</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Pune</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Hyderabad</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#fbbf24]"/> Chennai</li>
            </ul>
          </div>
          <div className="flex-1">
            <img 
              src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&q=80" 
              alt="Delivery boxes" 
              className="rounded-lg shadow-md object-cover w-full h-64"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Delivery;
