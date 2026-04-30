import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import { Loader2, Tag } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.CATEGORIES).then(r => r.json()),
      fetch(API_ENDPOINTS.PRODUCTS).then(r => r.json()),
    ])
      .then(([cats, products]) => {
        // Build map: categoryId (string) -> first product image_url
        const catImageMap = {};
        if (Array.isArray(products)) {
          products.forEach(p => {
            if (!p.image_url) return;
            // categoryId can be a populated object or a plain id string
            const catId = p.categoryId?._id
              ? String(p.categoryId._id)
              : p.categoryId
                ? String(p.categoryId)
                : null;
            if (catId && !catImageMap[catId]) {
              catImageMap[catId] = p.image_url;
            }
          });
        }

        // Priority: product image > admin-set cat.image > fallback
        const merged = Array.isArray(cats) ? cats.map(cat => ({
          ...cat,
          image: catImageMap[String(cat._id)] || cat.image || FALLBACK_IMAGE,
        })) : [];

        setCategories(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#ff5e00] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Categories</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">All Categories</h1>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-[#fbbf24] w-10 h-10" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <Tag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                className="group flex flex-col items-center gap-3 focus:outline-none"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-[#fbbf24] group-hover:shadow-lg transition-all duration-300 bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-700 group-hover:text-[#ff5e00] transition-colors text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
