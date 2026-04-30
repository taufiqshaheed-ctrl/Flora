import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Trash2, Plus, RefreshCw, BarChart2, ShieldAlert, Edit,
  MessageSquare, ShoppingBag, Loader2, User, Mail, Calendar,
  CreditCard, Tag, Users, CheckCircle2, ChevronDown, FileText, Save, BookOpen, MapPin
} from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending:    'bg-blue-50 text-blue-600 border-blue-100',
  processing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  shipped:    'bg-purple-50 text-purple-600 border-purple-100',
  delivered:  'bg-green-50 text-green-600 border-green-100',
  cancelled:  'bg-red-50 text-red-500 border-red-100',
};
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [careGuide, setCareGuide] = useState({ title: 'Care Guide', content: '' });
  const [careGuideSaving, setCareGuideSaving] = useState(false);
  const [careGuideSaved, setCareGuideSaved] = useState(false);

  // Blog state
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', image_url: '', publishedAt: '', h1: '', metaTitle: '', metaKeywords: '', metaDescription: '', contentImages: [] });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogDeleteId, setBlogDeleteId] = useState(null);
  const [blogImageFile, setBlogImageFile] = useState(null);

  // Pincode state
  const [pincodes, setPincodes] = useState([]);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeArea, setPincodeArea] = useState('');
  const [pincodeAdding, setPincodeAdding] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', originalPrice: '', description: '', image_url: '', categoryId: '' });

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState(null); // { id, name } | null
  const [catDeleteModal, setCatDeleteModal] = useState(null); // { id, name } | null
  const [orderDeleteModal, setOrderDeleteModal] = useState(null); // { id } | null
  const [msgDeleteModal, setMsgDeleteModal] = useState(null); // { id } | null
  const [userDeleteModal, setUserDeleteModal] = useState(null); // { id, name } | null
  const [alertModal, setAlertModal] = useState(''); // error message | ''

  // Category form
  const [catForm, setCatForm] = useState({ name: '', slug: '', image: '' });
  const [editingCatId, setEditingCatId] = useState(null);
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Helper: get auth header from localStorage
  const authHeader = () => {
    const token = localStorage.getItem('flora_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Validate image file before upload — returns error string or null
  const validateImageFile = (file) => {
    if (!file) return null;
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED = ['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/heic','image/heif','image/bmp','image/tiff'];
    if (file.size > MAX_SIZE) return `File is too large (${(file.size/1024/1024).toFixed(1)} MB). Max 10 MB.`;
    if (!ALLOWED.includes(file.type.toLowerCase())) return `File type "${file.type}" not supported. Use JPEG, PNG, WebP, or GIF.`;
    return null;
  };

  // Upload a file and return its URL — throws with a user-friendly message on failure
  const uploadFile = async (file) => {
    const validationError = validateImageFile(file);
    if (validationError) throw new Error(validationError);
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(API_ENDPOINTS.UPLOAD, { method: 'POST', headers: authHeader(), body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
    return data.url;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const [prodRes, catRes] = await Promise.all([
          fetch(API_ENDPOINTS.PRODUCTS),
          fetch(API_ENDPOINTS.CATEGORIES)
        ]);
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
      } else if (activeTab === 'orders') {
        const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, { headers: authHeader() });
        setAllOrders(await res.json());
      } else if (activeTab === 'messages') {
        const res = await fetch(API_ENDPOINTS.MESSAGES, { headers: authHeader() });
        setMessages(await res.json());
      } else if (activeTab === 'categories') {
        const res = await fetch(API_ENDPOINTS.CATEGORIES);
        setCategories(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch(API_ENDPOINTS.ADMIN_USERS, { headers: authHeader() });
        setAllUsers(await res.json());
      } else if (activeTab === 'content') {
        const res = await fetch(`${API_BASE_URL}/api/content/care-guide`);
        const data = await res.json();
        setCareGuide({ title: data.title || 'Care Guide', content: data.content || '' });
      } else if (activeTab === 'blog') {
        const res = await fetch(`${API_BASE_URL}/api/blogs`);
        setBlogs(await res.json());
      } else if (activeTab === 'pincodes') {
        const res = await fetch(`${API_BASE_URL}/api/pincodes`);
        setPincodes(await res.json());
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.role === 'admin') fetchData();
  }, [user, activeTab]);

  // ── PRODUCT HANDLERS ──────────────────────────────────────────────────────

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description || '',
      image_url: product.image_url,
      categoryId: product.categoryId?._id || product.categoryId || ''
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData({ name: '', price: '', originalPrice: '', description: '', image_url: '', categoryId: '' });
    setImageFile(null);
    const fi = document.getElementById('imageUpload');
    if (fi) fi.value = '';
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile);
      }
      if (!finalImageUrl) { setAlertModal('Please provide an image.'); setIsAdding(false); return; }

      const url = editingProductId ? `${API_ENDPOINTS.PRODUCTS}/${editingProductId}` : API_ENDPOINTS.PRODUCTS;
      const method = editingProductId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ ...formData, image_url: finalImageUrl })
      });
      if (!res.ok) throw new Error('Action failed');
      const saved = await res.json();
      setProducts(prev => editingProductId
        ? prev.map(p => p._id === editingProductId ? saved : p)
        : [...prev, saved]
      );
      handleCancelEdit();
    } catch (err) { setAlertModal('Error: ' + err.message); }
    setIsAdding(false);
  };

  const handleDelete = (id, name) => {
    setDeleteModal({ id, name });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    setDeleteModal(null);
    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { setAlertModal('Delete failed.'); }
  };

  // ── ORDER HANDLERS ────────────────────────────────────────────────────────

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setAllOrders(prev => prev.map(o => o._id === orderId ? updated : o));
    } catch { setAlertModal('Failed to update order status.'); }
  };

  const handleOrderDelete = (id) => setOrderDeleteModal({ id });

  const confirmOrderDelete = async () => {
    const { id } = orderDeleteModal;
    setOrderDeleteModal(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, { method: 'DELETE', headers: authHeader() });
      if (!res.ok) throw new Error('Delete failed');
      setAllOrders(prev => prev.filter(o => o._id !== id));
    } catch { setAlertModal('Failed to delete order.'); }
  };

  // ── MESSAGE HANDLERS ──────────────────────────────────────────────────────

  const handleMarkRead = async (msgId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${msgId}/read`, {
        method: 'PUT',
        headers: authHeader()
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setMessages(prev => prev.map(m => m._id === msgId ? updated : m));
    } catch { setAlertModal('Failed to mark as read.'); }
  };

  const handleMsgDelete = (id) => setMsgDeleteModal({ id });

  const confirmMsgDelete = async () => {
    const { id } = msgDeleteModal;
    setMsgDeleteModal(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, { method: 'DELETE', headers: authHeader() });
      if (!res.ok) throw new Error('Delete failed');
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch { setAlertModal('Failed to delete message.'); }
  };

  // ── CATEGORY HANDLERS ─────────────────────────────────────────────────────

  const handleCatEdit = (cat) => {
    setEditingCatId(cat._id);
    setCatForm({ name: cat.name, slug: cat.slug, image: cat.image || '' });
  };

  const handleCatCancel = () => { setEditingCatId(null); setCatForm({ name: '', slug: '', image: '' }); };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setIsSavingCat(true);
    try {
      const url = editingCatId ? `${API_ENDPOINTS.CATEGORIES}/${editingCatId}` : API_ENDPOINTS.CATEGORIES;
      const method = editingCatId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(catForm)
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      const saved = await res.json();
      setCategories(prev => editingCatId
        ? prev.map(c => c._id === editingCatId ? saved : c)
        : [...prev, saved]
      );
      handleCatCancel();
    } catch (err) { setAlertModal('Error: ' + err.message); }
    setIsSavingCat(false);
  };

  const handleCatDelete = (id, name) => {
    setCatDeleteModal({ id, name });
  };

  const confirmCatDelete = async () => {
    const { id } = catDeleteModal;
    setCatDeleteModal(null);
    try {
      const res = await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) throw new Error('Delete failed');
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch { setAlertModal('Delete failed.'); }
  };

  // ── USER HANDLERS ─────────────────────────────────────────────────────────

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const updated = await res.json();
      setAllUsers(prev => prev.map(u => u._id === userId ? updated : u));
    } catch (err) { setAlertModal('Error: ' + err.message); }
  };

  const handleUserDelete = (id, name) => {
    if (id === user.id) { setAlertModal('You cannot delete your own account.'); return; }
    setUserDeleteModal({ id, name });
  };

  const confirmUserDelete = async () => {
    const { id } = userDeleteModal;
    setUserDeleteModal(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeader() });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setAllUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) { setAlertModal('Error: ' + err.message); }
  };

  // ── ACCESS GUARD ──────────────────────────────────────────────────────────

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <ShieldAlert size={40} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-3">Access Denied</h2>
          <p className="text-gray-500 mb-8">Administrators only.</p>
          <Link to="/admin-login" className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-900 font-bold py-3.5 rounded-lg inline-block text-center">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setBlogForm(p => ({ ...p, contentImages: [...(p.contentImages || []), url] }));
    } catch (err) {
      setAlertModal(err.message);
    }
    e.target.value = '';
  };

  const resetBlogForm = () => {
    setBlogForm({ title: '', excerpt: '', content: '', image_url: '', publishedAt: '', h1: '', metaTitle: '', metaKeywords: '', metaDescription: '', contentImages: [] });
    setEditingBlogId(null);
    setBlogImageFile(null);
    const fi = document.getElementById('blogImageUpload');
    if (fi) fi.value = '';
  };

  const handleBlogEdit = (blog) => {
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      image_url: blog.image_url || '',
      publishedAt: blog.publishedAt ? blog.publishedAt.slice(0, 10) : '',
      h1: blog.h1 || '',
      metaTitle: blog.metaTitle || '',
      metaKeywords: blog.metaKeywords || '',
      metaDescription: blog.metaDescription || '',
      contentImages: blog.contentImages || [],
    });
    setEditingBlogId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogSave = async (e) => {
    e.preventDefault();
    setBlogSaving(true);
    let finalImageUrl = blogForm.image_url;
    if (blogImageFile) {
      try {
        finalImageUrl = await uploadFile(blogImageFile);
      } catch (err) {
        setAlertModal(err.message);
        setBlogSaving(false);
        return;
      }
    }
    const method = editingBlogId ? 'PUT' : 'POST';
    const url = editingBlogId ? `${API_BASE_URL}/api/blogs/${editingBlogId}` : `${API_BASE_URL}/api/blogs`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ ...blogForm, image_url: finalImageUrl }),
    });
    const saved = await res.json();
    if (editingBlogId) {
      setBlogs(prev => prev.map(b => b._id === editingBlogId ? saved : b));
    } else {
      setBlogs(prev => [saved, ...prev]);
    }
    resetBlogForm();
    setBlogSaving(false);
  };

  const handleBlogDelete = async (id) => {
    await fetch(`${API_BASE_URL}/api/blogs/${id}`, { method: 'DELETE', headers: authHeader() });
    setBlogs(prev => prev.filter(b => b._id !== id));
    setBlogDeleteId(null);
  };

  const handleAddPincode = async (e) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    setPincodeAdding(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pincodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ code: pincodeInput.trim(), area: pincodeArea.trim() }),
      });
      const saved = await res.json();
      if (res.ok) {
        setPincodes(prev => [...prev, saved].sort((a, b) => a.code.localeCompare(b.code)));
        setPincodeInput('');
        setPincodeArea('');
      }
    } catch { /* silent */ }
    setPincodeAdding(false);
  };

  const handleDeletePincode = async (id) => {
    await fetch(`${API_BASE_URL}/api/pincodes/${id}`, { method: 'DELETE', headers: authHeader() });
    setPincodes(prev => prev.filter(p => p._id !== id));
  };

  const handleSaveCareGuide = async () => {
    setCareGuideSaving(true);
    try {
      await fetch(`${API_BASE_URL}/api/content/care-guide`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(careGuide),
      });
      setCareGuideSaved(true);
      setTimeout(() => setCareGuideSaved(false), 2500);
    } catch { /* silent */ }
    setCareGuideSaving(false);
  };

  const TABS = [
    { id: 'inventory',  label: 'Inventory',  icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'orders',     label: 'Orders',     icon: ShoppingBag },
    { id: 'messages',   label: 'Messages',   icon: MessageSquare },
    { id: 'users',      label: 'Users',      icon: Users },
    { id: 'content',    label: 'Content',    icon: FileText },
    { id: 'blog',       label: 'Blog',       icon: BookOpen },
    { id: 'pincodes',   label: 'Pincodes',   icon: MapPin },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-10">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
              <BarChart2 className="text-[#fbbf24] w-10 h-10" /> Admin Command Center
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Full control over products, categories, orders, messages, and users.</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 text-sm font-bold bg-white border border-gray-200 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            {loading ? <Loader2 size={18} className="animate-spin text-[#fbbf24]" /> : <RefreshCw size={18} className="text-gray-400" />}
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── INVENTORY TAB ── */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                  {editingProductId ? <Edit className="text-blue-500" size={22} /> : <Plus className="text-green-500" size={22} />}
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="Product Name" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange}
                      className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="Sale Price (₹)" />
                    <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                      className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="MRP / Original (₹)" />
                  </div>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50 resize-none" placeholder="Product Description (optional)" />
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleChange}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50 mb-2" placeholder="Image URL" disabled={!!imageFile} />
                  <div>
                    <input id="imageUpload" type="file" accept="image/*" onChange={e => { if (e.target.files[0]) setImageFile(e.target.files[0]); }} className="hidden" disabled={!!formData.image_url} />
                    <label htmlFor="imageUpload" className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.image_url ? 'opacity-40 border-gray-100' : 'border-gray-200 hover:border-[#fbbf24] hover:bg-yellow-50'}`}>
                      <Plus size={18} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-500">{imageFile ? imageFile.name : 'Upload Image'}</span>
                    </label>
                  </div>
                  <button type="submit" disabled={isAdding} className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {isAdding ? <Loader2 className="animate-spin mx-auto" /> : (editingProductId ? 'Save Changes' : 'Publish Product')}
                  </button>
                  {editingProductId && <button type="button" onClick={handleCancelEdit} className="w-full text-gray-500 font-bold py-2 hover:text-red-500 text-center text-sm">Cancel</button>}
                </form>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">Products ({products.length})</h2>
                </div>
                {loading ? <div className="p-16 text-center text-gray-400"><Loader2 className="animate-spin mx-auto mb-4" /> Loading...</div> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-gray-400 text-xs font-black uppercase tracking-widest">
                          <th className="p-4 w-[55%]">Product</th>
                          <th className="p-4 text-right">Price / MRP</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50/50 transition-all">
                            <td className="p-4 flex items-center gap-4">
                              <img src={p.image_url} className="w-14 h-14 rounded-xl object-cover shadow-sm bg-gray-100 shrink-0" alt={p.name} />
                              <div className="min-w-0">
                                <p className="font-black text-gray-900 truncate">{p.name}</p>
                                <span className="bg-[#fbbf24]/10 text-[#b4860b] px-2 py-0.5 rounded text-[10px] font-black uppercase border border-[#fbbf24]/20">
                                  {p.categoryId?.name || 'Uncategorized'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="font-black text-gray-900">₹{parseFloat(p.price).toLocaleString()}</span>
                                {p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.price) && (
                                  <>
                                    <span className="text-xs text-gray-400 line-through">₹{parseFloat(p.originalPrice).toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-[#c9a84c]">
                                      {Math.round((parseFloat(p.originalPrice) - parseFloat(p.price)) / parseFloat(p.originalPrice) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-1.5">
                                <button onClick={() => handleEdit(p)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(p._id, p.name)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                  {editingCatId ? <Edit className="text-blue-500" size={22} /> : <Plus className="text-green-500" size={22} />}
                  {editingCatId ? 'Edit Category' : 'Add Category'}
                </h2>
                <form onSubmit={handleCatSubmit} className="space-y-4">
                  <input type="text" required value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="Category Name (e.g. Flowers)" />
                  <input type="text" required value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="slug (e.g. flowers)" />
                  <input type="url" value={catForm.image} onChange={e => setCatForm(f => ({ ...f, image: e.target.value }))}
                    className="w-full border-2 border-gray-50 rounded-xl p-3.5 outline-none focus:border-[#fbbf24] bg-gray-50/50" placeholder="Category Image URL" />
                  {catForm.image && (
                    <img src={catForm.image} alt="preview" className="w-full h-28 object-cover rounded-xl border border-gray-100" onError={e => e.target.style.display='none'} />
                  )}
                  <button type="submit" disabled={isSavingCat} className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {isSavingCat ? <Loader2 className="animate-spin mx-auto" /> : (editingCatId ? 'Save Changes' : 'Create Category')}
                  </button>
                  {editingCatId && <button type="button" onClick={handleCatCancel} className="w-full text-gray-500 font-bold py-2 hover:text-red-500 text-center text-sm">Cancel</button>}
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                  <h2 className="text-xl font-black text-gray-900">All Categories ({categories.length})</h2>
                </div>
                {loading ? <div className="p-16 text-center"><Loader2 className="animate-spin mx-auto text-[#fbbf24]" /></div> : (
                  <div className="divide-y divide-gray-50">
                    {categories.map(cat => (
                      <div key={cat._id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                        <div className="flex items-center gap-4">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                              <Tag size={20} className="text-gray-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-black text-gray-900">{cat.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleCatEdit(cat)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                          <button onClick={() => handleCatDelete(cat._id, cat.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto w-12 h-12 text-[#fbbf24]" /></div>
              : allOrders.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
                  <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
                  <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet.</h2>
                </div>
              ) : allOrders.map(order => (
                <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 sm:p-8 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <User className="text-[#fbbf24]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{order.userId?.name || 'Customer'}</h3>
                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1"><Mail size={12} /> {order.userId?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm font-bold items-center">
                      <div className="bg-white px-4 py-2 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Order ID</p>
                        <p className="text-gray-900 font-mono text-xs">#{order._id.toString().slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                        <p className="text-green-600">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                      </div>
                      {/* Status dropdown */}
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-black uppercase border cursor-pointer outline-none ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                      <button onClick={() => handleOrderDelete(order._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Delete order">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={14} /> Items ({order.items?.length})</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                            <img src={item.product?.image_url} className="w-10 h-10 rounded-xl object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-sm truncate">{item.product?.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.product?.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CreditCard size={14} /> Delivery</h4>
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-50 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment:</span>
                          <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                          <ShieldAlert size={14} className="text-[#fbbf24] mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-900 leading-relaxed">{order.shippingAddress?.address}</p>
                            <p className="text-gray-400">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
                            <p className="font-bold text-gray-900 mt-0.5">📞 {order.shippingAddress?.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto w-12 h-12 text-[#fbbf24]" /></div>
              : messages.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
                  <MessageSquare size={64} className="text-gray-200 mx-auto mb-6" />
                  <h2 className="text-2xl font-black text-gray-900">Inbox is clean.</h2>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {messages.map(msg => (
                    <div key={msg._id} className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-lg transition-all relative overflow-hidden ${msg.status === 'unread' ? 'border-[#fbbf24]/30' : 'border-gray-100'}`}>
                      <div className={`absolute top-0 left-0 w-full h-1 ${msg.status === 'unread' ? 'bg-[#fbbf24]' : 'bg-transparent'}`}></div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#fbbf24] font-black text-sm">
                          {msg.firstName[0]}{msg.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-sm">{msg.firstName} {msg.lastName}</h4>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {new Date(msg.createdAt).toLocaleDateString()}</p>
                        </div>
                        {msg.status === 'unread' && <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">New</span>}
                      </div>
                      <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-50 mb-4 min-h-[80px]">
                        <p className="text-gray-700 font-medium text-sm leading-relaxed">"{msg.message}"</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <a href={`mailto:${msg.email}`} className="text-[#fbbf24] hover:text-[#f59e0b] font-bold text-xs flex items-center gap-1 underline underline-offset-4">
                          <Mail size={12} /> Reply
                        </a>
                        <div className="flex items-center gap-2">
                          {msg.status === 'unread' && (
                            <button onClick={() => handleMarkRead(msg._id)} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-600 transition-colors">
                              <CheckCircle2 size={14} /> Mark Read
                            </button>
                          )}
                          <button onClick={() => handleMsgDelete(msg._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete message">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Care Guide</h2>
              <button
                onClick={handleSaveCareGuide}
                disabled={careGuideSaving}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8953e] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                <Save size={15} />
                {careGuideSaving ? 'Saving…' : careGuideSaved ? '✓ Saved!' : 'Save'}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Page Title</label>
              <input
                type="text"
                value={careGuide.title}
                onChange={e => setCareGuide(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Content <span className="normal-case font-normal text-gray-400">(HTML supported — use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;)</span>
              </label>
              <textarea
                value={careGuide.content}
                onChange={e => setCareGuide(p => ({ ...p, content: e.target.value }))}
                rows={28}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#c9a84c] resize-y"
              />
            </div>
          </div>
        )}

        {/* ── BLOG TAB ── */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

            {/* ── Form ── */}
            <div className="xl:col-span-3">
              <form onSubmit={handleBlogSave} className="flex flex-col gap-5">

                {/* ── Basic Info ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Basic Info</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Post Title <span className="text-red-400">*</span></label>
                      <input required value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Best Rakhis Under ₹500"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Publish Date</label>
                      <input type="date" value={blogForm.publishedAt} onChange={e => setBlogForm(p => ({ ...p, publishedAt: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Excerpt <span className="font-normal text-gray-400">(shown on listing card)</span></label>
                      <textarea rows={3} value={blogForm.excerpt} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))}
                        placeholder="Short summary of the post…"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c] resize-none" />
                    </div>
                  </div>
                </div>

                {/* ── Cover Image ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Cover Image</p>
                  <div className="flex flex-col gap-3">
                    <input value={blogForm.image_url} onChange={e => setBlogForm(p => ({ ...p, image_url: e.target.value }))}
                      disabled={!!blogImageFile} placeholder="Paste image URL…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c] disabled:opacity-40" />
                    <input id="blogImageUpload" type="file" accept="image/*" className="hidden"
                      disabled={!!blogForm.image_url}
                      onChange={e => { if (e.target.files[0]) setBlogImageFile(e.target.files[0]); }} />
                    <label htmlFor="blogImageUpload"
                      className={`flex items-center justify-center gap-2 p-3.5 border-2 border-dashed rounded-xl cursor-pointer transition-all text-sm font-semibold
                        ${blogForm.image_url ? 'opacity-40 border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-400 hover:border-[#c9a84c] hover:bg-yellow-50'}`}>
                      <Plus size={15} /> {blogImageFile ? blogImageFile.name : 'Upload from gallery'}
                    </label>
                    {blogImageFile && (
                      <button type="button" onClick={() => { setBlogImageFile(null); const fi = document.getElementById('blogImageUpload'); if (fi) fi.value = ''; }}
                        className="text-xs text-red-400 hover:text-red-600 text-left">✕ Remove file</button>
                    )}
                    {blogForm.image_url && <img src={blogForm.image_url} alt="preview" className="w-full h-32 object-cover rounded-xl mt-1" onError={e => e.target.style.display='none'} />}
                  </div>
                </div>

                {/* ── Content Images ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Content Images</p>
                  <p className="text-xs text-gray-400 mb-4">Upload images to use inside the post — copy the URL and paste it into your HTML content.</p>
                  <input id="contentImageUpload" type="file" accept="image/*" className="hidden" onChange={handleContentImageUpload} />
                  <label htmlFor="contentImageUpload"
                    className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer text-sm font-semibold text-gray-400 hover:border-[#c9a84c] hover:bg-yellow-50 transition-all">
                    <Plus size={15} /> Upload content image
                  </label>
                  {blogForm.contentImages && blogForm.contentImages.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3">
                      {blogForm.contentImages.map((url, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                          <img src={url} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
                          <p className="text-xs text-gray-500 font-mono flex-1 break-all truncate">{url}</p>
                          <button type="button" onClick={() => {
                            navigator.clipboard.writeText(`<img src="${url}" alt="" />`).catch(() => {});
                          }} className="text-xs font-bold text-[#c9a84c] hover:underline shrink-0">Copy tag</button>
                          <button type="button" onClick={() => setBlogForm(p => ({ ...p, contentImages: p.contentImages.filter((_, j) => j !== i) }))}
                            className="text-gray-300 hover:text-red-400 shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Full Content ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Content</p>
                  <p className="text-xs text-gray-400 mb-4">HTML supported — use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;img src="…"&gt;, etc.</p>
                  <textarea rows={16} value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))}
                    placeholder="<p>Start writing your post…</p>"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#c9a84c] resize-y" />
                </div>

                {/* ── SEO ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">SEO</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">H1 Heading <span className="font-normal text-gray-400">(page's main visible heading)</span></label>
                      <input value={blogForm.h1} onChange={e => setBlogForm(p => ({ ...p, h1: e.target.value }))}
                        placeholder="Same as title or a keyword-rich variant"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Meta Title <span className="font-normal text-gray-400">(shown in browser tab & search results — 50–60 chars)</span></label>
                      <input value={blogForm.metaTitle} onChange={e => setBlogForm(p => ({ ...p, metaTitle: e.target.value }))}
                        placeholder="e.g. Best Rakhis Under ₹500 | FloralAdda"
                        maxLength={70}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]" />
                      <p className="text-right text-xs text-gray-300 mt-1">{blogForm.metaTitle.length}/70</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Meta Keywords <span className="font-normal text-gray-400">(comma-separated)</span></label>
                      <input value={blogForm.metaKeywords} onChange={e => setBlogForm(p => ({ ...p, metaKeywords: e.target.value }))}
                        placeholder="rakhi, raksha bandhan gift, rakhi under 500"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Meta Description <span className="font-normal text-gray-400">(shown under title in search results — 150–160 chars)</span></label>
                      <textarea rows={3} value={blogForm.metaDescription} onChange={e => setBlogForm(p => ({ ...p, metaDescription: e.target.value }))}
                        placeholder="A brief description of the post for search engines…"
                        maxLength={170}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c] resize-none" />
                      <p className="text-right text-xs text-gray-300 mt-1">{blogForm.metaDescription.length}/170</p>
                    </div>
                  </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex gap-3 pb-4">
                  <button type="submit" disabled={blogSaving}
                    className="flex-1 bg-[#c9a84c] hover:bg-[#b8953e] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
                    {blogSaving ? 'Saving…' : editingBlogId ? 'Update Post' : 'Publish Post'}
                  </button>
                  {editingBlogId && (
                    <button type="button" onClick={resetBlogForm}
                      className="px-6 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── Post List ── */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Published Posts ({blogs.length})</p>
                {loading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#c9a84c]" /></div>
                ) : blogs.length === 0 ? (
                  <p className="text-center py-10 text-gray-400 text-sm">No posts yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {blogs.map(blog => (
                      <div key={blog._id} className="flex gap-3 items-start p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                        {blog.image_url
                          ? <img src={blog.image_url} alt={blog.title} className="w-16 h-12 object-cover rounded-xl shrink-0" />
                          : <div className="w-16 h-12 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-xl">📝</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400 mb-0.5">{new Date(blog.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p className="font-bold text-gray-900 text-xs line-clamp-2 leading-snug">{blog.title}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button onClick={() => handleBlogEdit(blog)} className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-yellow-50 rounded-lg transition-all">
                            <Edit size={13} />
                          </button>
                          <button onClick={() => setBlogDeleteId(blog._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── PINCODES TAB ── */}
        {activeTab === 'pincodes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Add form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-black text-gray-900 mb-1">Add Pincode</h2>
                <p className="text-xs text-gray-400 mb-5">Orders to unlisted pincodes will be rejected at checkout.</p>
                <form onSubmit={handleAddPincode} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode <span className="text-red-400">*</span></label>
                    <input
                      required
                      value={pincodeInput}
                      onChange={e => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="e.g. 342001"
                      maxLength={6}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c] font-mono tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Area / Label <span className="font-normal text-gray-400">(optional)</span></label>
                    <input
                      value={pincodeArea}
                      onChange={e => setPincodeArea(e.target.value)}
                      placeholder="e.g. Jodhpur City"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pincodeAdding || pincodeInput.length < 4}
                    className="w-full bg-[#c9a84c] hover:bg-[#b8953e] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={15} /> {pincodeAdding ? 'Adding…' : 'Add Pincode'}
                  </button>
                </form>
              </div>
            </div>

            {/* Pincode list */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-lg font-black text-gray-900">Deliverable Pincodes</h2>
                  <span className="text-xs font-bold bg-[#f9f5ee] text-[#c9a84c] px-3 py-1.5 rounded-full">{pincodes.length} pincode{pincodes.length !== 1 ? 's' : ''}</span>
                </div>
                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#c9a84c]" /></div>
                ) : pincodes.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <MapPin size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-semibold">No pincodes added yet.</p>
                    <p className="text-xs mt-1">Add pincodes to enable delivery for those areas.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {pincodes.map(p => (
                      <div key={p._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <div className="w-9 h-9 rounded-xl bg-[#f9f5ee] flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-[#c9a84c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-gray-900 font-mono text-sm tracking-wider">{p.code}</span>
                          {p.area && <span className="ml-2 text-xs text-gray-400">{p.area}</span>}
                        </div>
                        <button
                          onClick={() => handleDeletePincode(p._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove pincode"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">All Users ({allUsers.length})</h2>
              </div>
              {loading ? <div className="p-16 text-center"><Loader2 className="animate-spin mx-auto text-[#fbbf24]" /></div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Verified</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-center">Role</th>
                        <th className="p-4 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allUsers.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border ${u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-gray-900 text-sm">{u.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{u.email}</td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isVerified ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {u.isVerified ? '✓ Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            {u._id === user.id ? (
                              <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">You (Admin)</span>
                            ) : (
                              <select
                                value={u.role}
                                onChange={e => handleRoleChange(u._id, e.target.value)}
                                className={`text-xs font-black px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none ${u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {u._id !== user.id && (
                              <button onClick={() => handleUserDelete(u._id, u.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Delete user">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Alert Modal */}
      {alertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAlertModal('')} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-gray-100 text-center">
            <p className="text-gray-800 font-bold mb-6">{alertModal}</p>
            <button onClick={() => setAlertModal('')} className="w-full py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-all">OK</button>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
      {catDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCatDeleteModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Category?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              Are you sure you want to delete<br />
              <span className="font-bold text-gray-900">"{catDeleteModal.name}"</span>?<br />
              Products in this category will lose their category.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCatDeleteModal(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmCatDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Delete Confirmation Modal */}
      {orderDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderDeleteModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Order?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              This will permanently delete the order.<br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setOrderDeleteModal(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmOrderDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Message Delete Confirmation Modal */}
      {msgDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMsgDeleteModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Message?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              This will permanently delete the message.<br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setMsgDeleteModal(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmMsgDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {userDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setUserDeleteModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete User?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              Are you sure you want to delete<br />
              <span className="font-bold text-gray-900">"{userDeleteModal.name}"</span>?<br />
              This will permanently remove the account.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setUserDeleteModal(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={confirmUserDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={30} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-center text-sm mb-8">
              Are you sure you want to delete<br />
              <span className="font-bold text-gray-900">"{deleteModal.name}"</span>?<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Delete Modal */}
      {blogDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBlogDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm text-center mb-8">This blog post will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setBlogDeleteId(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={() => handleBlogDelete(blogDeleteId)} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
