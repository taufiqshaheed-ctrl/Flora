import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, User, Trash2, Edit3, Plus, Loader2, Save, X, Home, CheckCircle2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

/**
 * AddressBook Component
 * CRUD for user shipping addresses.
 */
const getToken = () => localStorage.getItem('flora_token');

const AddressBook = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', pincode: '', isDefault: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // address id | null

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES}/${user.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user.id]);

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({ ...addr });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', phone: '', address: '', city: '', pincode: '', isDefault: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const url = editingId 
      ? `${API_ENDPOINTS.ADDRESSES}/${editingId}` 
      : API_ENDPOINTS.ADDRESSES;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        handleCancel();
        fetchAddresses();
      } else {
        setAlertMsg('Failed to save address');
      }
    } catch (err) {
      setAlertMsg('Error saving address');
    }
    setFormLoading(false);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmAddrDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try {
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) fetchAddresses();
      else setAlertMsg('Delete failed');
    } catch (err) {
      setAlertMsg('Delete failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-balance">

      {/* Alert Modal */}
      {alertMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAlertMsg('')} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-gray-100 text-center">
            <p className="text-gray-800 font-bold mb-6">{alertMsg}</p>
            <button onClick={() => setAlertMsg('')} className="w-full py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-all">OK</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Address?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmAddrDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 leading-none">Address Book</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Manage your shipping destinations for faster checkout.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-900 font-black px-6 py-4 rounded-2xl transition-all shadow-lg shadow-yellow-100 active:scale-95"
          >
            <Plus size={20} /> Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-3xl border-2 border-[#fbbf24] shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-yellow-50/30">
             <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <MapPin className="text-[#fbbf24]" size={24} /> {editingId ? 'Edit Address' : 'New Address'}
             </h3>
             <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Receiver Name</label>
                   <input 
                     type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-[#fbbf24] transition-all font-bold"
                     placeholder="e.g. Rahul Kumar"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                   <input 
                     type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-[#fbbf24] transition-all font-bold"
                     placeholder="10-digit mobile"
                   />
                </div>
                <div className="md:col-span-2 space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Complete Address</label>
                   <textarea 
                     required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                     className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-[#fbbf24] transition-all font-bold min-h-[100px]"
                     placeholder="Flat/House No, Colony, Street..."
                   ></textarea>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">City</label>
                   <input 
                     type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                     className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-[#fbbf24] transition-all font-bold"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pincode</label>
                   <input 
                     type="text" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                     className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:border-[#fbbf24] transition-all font-bold"
                   />
                </div>
             </div>
             <div className="flex items-center gap-3">
                <input 
                  type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-[#fbbf24] focus:ring-[#fbbf24]"
                />
                <label htmlFor="isDefault" className="text-sm font-bold text-gray-700">Set as Default Address</label>
             </div>
             <div className="pt-4 flex gap-4">
                <button 
                   type="submit" disabled={formLoading}
                   className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                >
                   {formLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {editingId ? 'Update Address' : 'Save Address'}</>}
                </button>
                <button type="button" onClick={handleCancel} className="px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl">Cancel</button>
             </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center text-gray-400"><Loader2 className="animate-spin mx-auto mb-4" /> Loading addresses...</div>
        ) : addresses.length === 0 && !isAdding ? (
          <div className="col-span-full bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <MapPin size={32} />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">No Saved Addresses</h3>
             <p className="text-gray-500 font-medium">Add a shipping address to speed up your checkout process.</p>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
               {addr.isDefault && (
                 <div className="absolute top-0 right-0 bg-[#fbbf24] text-gray-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-bl-2xl flex items-center gap-1">
                    <CheckCircle2 size={12} /> Default
                 </div>
               )}
               <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-[#fbbf24] group-hover:bg-yellow-50 transition-all">
                     <Home size={24} />
                  </div>
                  <div>
                     <h4 className="font-black text-gray-900 text-lg leading-none">{addr.name}</h4>
                     <p className="text-sm font-bold text-gray-400 mt-2 flex items-center gap-2"><Phone size={14} /> {addr.phone}</p>
                  </div>
               </div>
               <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-50 mb-6">
                  <p className="text-gray-900 font-bold text-sm leading-relaxed">{addr.address}</p>
                  <p className="text-gray-400 text-xs mt-1 font-black uppercase tracking-widest">{addr.city}, {addr.pincode}</p>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(addr)} className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-black py-3 rounded-xl hover:bg-black transition-all text-xs">
                     <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AddressBook;
