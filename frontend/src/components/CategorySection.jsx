import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';

const ALL_IMAGE = 'https://images.unsplash.com/photo-1543888544-2451ab04fb92?w=300&q=80';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80';

const CategorySection = ({ selectedCategory, onSelectCategory, products = [] }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  // Build a map: categoryId -> first product image
  const catImageMap = {};
  products.forEach(p => {
    const catId = p.categoryId?._id || p.categoryId;
    if (catId && p.image_url && !catImageMap[catId]) {
      catImageMap[catId] = p.image_url;
    }
  });

  // For "All": pick first product image overall
  const allFirstImage = products[0]?.image_url || ALL_IMAGE;

  const allCategories = [
    { _id: 'all', name: 'All', image: allFirstImage },
    ...categories.map(cat => ({
      ...cat,
      // Priority: 1) first product in this category, 2) cat.image set by admin, 3) fallback
      image: catImageMap[cat._id] || cat.image || FALLBACK_IMAGE,
    })),
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-center text-[#1e293b] mb-8 tracking-wide">
          SHOP BY CATEGORY
        </h2>
        
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x items-start justify-start md:justify-center">
          {allCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category.name)}
              className="group flex flex-col items-center gap-3 min-w-[90px] snap-center outline-none"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm p-1 ${selectedCategory === category.name ? 'border-[#fbbf24] shadow-md scale-105' : 'border-transparent group-hover:border-[#fbbf24] group-hover:shadow-md'}`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80'; }}
                  />
                </div>
              </div>
              <span className={`text-xs md:text-sm font-semibold text-center w-24 leading-tight transition-colors ${selectedCategory === category.name ? 'text-[#fbbf24]' : 'text-gray-700 group-hover:text-[#fbbf24]'}`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
