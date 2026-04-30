import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80';

const CategorySection = ({ selectedCategory, onSelectCategory, products = [] }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setCategories(data))
      .catch(() => {});
  }, []);

  // Build map: categoryId (string) -> first product image_url
  const catImageMap = {};
  products.forEach(p => {
    if (!p.image_url) return;
    const catId = p.categoryId?._id
      ? String(p.categoryId._id)
      : p.categoryId ? String(p.categoryId) : null;
    if (catId && !catImageMap[catId]) catImageMap[catId] = p.image_url;
  });

  const allCategories = [
    { _id: 'all', name: 'All', image: products[0]?.image_url || FALLBACK_IMAGE },
    ...categories.map(cat => ({
      ...cat,
      image: catImageMap[String(cat._id)] || cat.image || FALLBACK_IMAGE,
    })),
  ];

  const handleClick = (cat) => {
    if (cat._id === 'all') {
      onSelectCategory('All');
      navigate('/');
    } else {
      navigate(`/category/${encodeURIComponent(cat.name)}`);
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-tight">
          All categories
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {allCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleClick(cat)}
              className="group relative aspect-square rounded-xl overflow-hidden focus:outline-none"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.src = FALLBACK_IMAGE; }}
              />
              {/* Dark overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${selectedCategory === cat.name ? 'bg-black/50' : 'bg-black/30 group-hover:bg-black/40'}`} />
              {/* Category name */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 px-1">
                <span className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide text-center leading-tight drop-shadow-sm">
                  {cat.name}
                </span>
              </div>
              {/* Active border */}
              {selectedCategory === cat.name && (
                <div className="absolute inset-0 border-2 border-[#c9a84c] rounded-xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
