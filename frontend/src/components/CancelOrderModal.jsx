import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CANCELLATION_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a cheaper alternative",
  "Expected delivery is too late",
  "Other"
];

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedReason) {
      setError('Please select a reason for cancellation.');
      return;
    }
    
    if (selectedReason === 'Other' && !customReason.trim()) {
      setError('Please provide a reason.');
      return;
    }

    const finalReason = selectedReason === 'Other' ? customReason.trim() : selectedReason;
    onConfirm(orderId, finalReason);
    
    // Reset state after confirm
    setSelectedReason('');
    setCustomReason('');
    setError('');
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start gap-4 bg-red-50/50">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
            <p className="text-sm text-gray-500 mt-1">Are you sure you want to cancel order <span className="font-semibold text-gray-700">{orderId}</span>? This action cannot be undone.</p>
          </div>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Please tell us why you are cancelling:</h3>
          
          <div className="space-y-3">
            {CANCELLATION_REASONS.map((reason) => (
              <label 
                key={reason} 
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReason === reason 
                    ? 'border-red-500 bg-red-50/30' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="mt-0.5">
                  <input 
                    type="radio" 
                    name="cancel_reason" 
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setError('');
                    }}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                </div>
                <span className={`text-sm font-medium ${selectedReason === reason ? 'text-gray-900' : 'text-gray-700'}`}>
                  {reason}
                </span>
              </label>
            ))}
          </div>

          {/* Conditional Custom Reason Input */}
          {selectedReason === 'Other' && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <textarea
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Can you share more details?"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none h-24"
              ></textarea>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-semibold mt-4 flex items-center gap-1">
               <AlertTriangle size={14} /> {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
          <button 
            onClick={handleClose}
            className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Keep Order
          </button>
          <button 
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
