import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Truck, Clock, Loader2 } from 'lucide-react';

const Orders = () => {
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#fbbf24] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-8">You haven't placed any orders. Start exploring our collection!</p>
          <Link to="/" className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-3.5 rounded-lg transition-colors inline-block text-center whitespace-nowrap">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'processing': 
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 mt-2">Track, manage, and view your recent purchases.</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Order Header */}
              <div className="bg-gray-50/50 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Order ID</p>
                    <p className="font-bold text-gray-900">#ORD-{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Date Placed</p>
                    <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Total Amount</p>
                    <p className="font-bold text-gray-900">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 sm:p-6">
                
                {/* Visual Tracking Timeline */}
                <div className="mb-10 mt-2 relative">
                  {order.status.toLowerCase() === 'cancelled' ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
                      <Clock className="shrink-0 mt-0.5" /> 
                      <div className="w-full">
                        <p className="font-bold">Order Cancelled</p>
                        <p className="text-sm text-red-600/80 mt-1">This order was cancelled and will not be delivered.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2 sm:px-4 z-0">
                      {/* Connecting Line background */}
                      <div className="absolute top-4 sm:top-1/2 left-[10%] right-[10%] h-0.5 sm:h-1 bg-gray-200 -translate-y-1/2 -z-10 rounded-full"></div>
                      
                      {/* Connecting Line active */}
                      <div className={`absolute top-4 sm:top-1/2 left-[10%] h-0.5 sm:h-1 bg-green-500 -translate-y-1/2 -z-10 rounded-full transition-all duration-1000 ${
                        ['pending', 'processing'].includes(order.status.toLowerCase()) ? 'w-[25%]' : 
                        order.status.toLowerCase() === 'shipped' ? 'w-[50%]' : 
                        order.status.toLowerCase() === 'delivered' ? 'w-[80%]' : 'w-0'
                      }`}></div>

                      {/* Step 1 */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle size={14} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-700">Placed</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                          {['pending', 'processing'].includes(order.status.toLowerCase()) ? (
                            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-white"></span>
                            </span>
                          ) : <Clock size={14} />}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'text-gray-700' : 'text-gray-400'}`}>Process</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                          <Truck size={14} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'text-gray-700' : 'text-gray-400'}`}>Shipped</span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${order.status.toLowerCase() === 'delivered' ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                          <Package size={14} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold ${order.status.toLowerCase() === 'delivered' ? 'text-gray-700' : 'text-gray-400'}`}>Arrived</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Items inside this package</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 leading-snug line-clamp-2">{item.product.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-black text-gray-900">₹{item.product.price}</p>
                          {order.status.toLowerCase() !== 'cancelled' && (
                            <p className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                              Expected arrival: 3-5 Business Days
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

