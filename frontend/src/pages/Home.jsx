import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import { mockProducts } from '../data/mockProducts';
import { API_ENDPOINTS } from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Slider Area */}
      <HeroSlider />

      {/* Shop By Category Layer */}
      <CategorySection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Collection Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? `Search Results for "${searchQuery}"` : (selectedCategory === 'All' ? 'Trending Gifts & Supplies' : `${selectedCategory} Collection`)}
            </h2>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">Found {products.filter(p => {
                const catName = p.categoryId?.name || p.category || '';
                const matchesCat = selectedCategory === 'All' || catName === selectedCategory;
                const matchesQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesQuery;
              }).length} items</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {searchQuery && (
              <Link 
                to="/"
                className="text-[#fbbf24] font-semibold hover:text-[#f59e0b] text-sm"
              >
                Clear Search
              </Link>
            )}
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-[#fbbf24] font-semibold hover:text-[#f59e0b] text-sm"
              >
                Clear Category
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#fbbf24]"></div>
          </div>
        ) : (
          (() => {
            const filteredProducts = products.filter(p => {
              const catName = p.categoryId?.name || p.category || '';
              const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;
              const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            });

            if (filteredProducts.length === 0) {
              return (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search terms or category filters.</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            );
          })()
        )}
      </main>

    </div>
  );
};

export default Home;
