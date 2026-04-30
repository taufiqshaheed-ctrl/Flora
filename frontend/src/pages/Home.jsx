import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import { mockProducts } from '../data/mockProducts';
import { API_ENDPOINTS, API_BASE_URL } from '../config';

const COLS = 5; // products per row (lg grid)
const ROWS = 2; // rows to show per category

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => { setSelectedCategory(categoryParam); }, [categoryParam]);

  useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.PRODUCTS).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/categories`).then(r => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(Array.isArray(cats) ? cats : []);
        setLoading(false);
      })
      .catch(() => { setProducts(mockProducts); setLoading(false); });
  }, []);

  const isFiltered = searchQuery || selectedCategory !== 'All';

  const filteredProducts = products.filter(p => {
    const catName = p.categoryId?.name || p.category || '';
    const matchesCat = selectedCategory === 'All' || catName === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Group products by category, preserving category order
  const productsByCategory = categories.map(cat => ({
    category: cat,
    items: products.filter(p =>
      (p.categoryId?._id || p.categoryId) === cat._id ||
      p.categoryId?.name === cat.name
    ),
  })).filter(g => g.items.length > 0);

  const handleViewAll = (catName) => {
    setSelectedCategory(catName);
    navigate(`/?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Slider */}
      <HeroSlider />

      {/* Delivery badge */}
      <div className="bg-[#f9f5ee] border-y border-[#e8dfc8] py-2.5 text-center text-sm font-medium text-[#7a6535] tracking-wide">
        🕐 Delivery happens within: <span className="font-bold">1–12 hours</span>
      </div>

      {/* Category Section */}
      <CategorySection
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigate(cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`);
        }}
        products={products}
      />

      <div className="container mx-auto px-4">
        <hr className="border-gray-100" />
      </div>

      {/* ── Filtered / Search view ── */}
      {isFiltered ? (
        <main className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory}
            </h2>
            <div className="flex items-center gap-4 text-sm">
              {searchQuery && (
                <Link to="/" className="text-[#c9a84c] hover:underline font-medium">Clear search</Link>
              )}
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => { setSelectedCategory('All'); navigate('/'); }}
                  className="text-[#c9a84c] hover:underline font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#c9a84c]" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {filteredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      ) : (
        /* ── Category-grouped home view ── */
        <main className="container mx-auto px-4 py-10 flex flex-col gap-14">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#c9a84c]" />
            </div>
          ) : productsByCategory.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold">No products yet</p>
            </div>
          ) : (
            productsByCategory.map(({ category, items }) => {
              const preview = items.slice(0, COLS * ROWS);
              const hasMore = items.length > preview.length;
              return (
                <section key={category._id}>
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-sm text-gray-400 mt-0.5">{category.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewAll(category.name)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#c9a84c] border border-[#c9a84c] rounded-full px-4 py-1.5 hover:bg-[#c9a84c] hover:text-white transition-colors"
                    >
                      View All
                      {items.length > preview.length && (
                        <span className="text-xs opacity-70">({items.length})</span>
                      )}
                    </button>
                  </div>

                  {/* Product grid – 2 rows */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                    {preview.map(product => (
                      <ProductCard key={product._id || product.id} product={product} />
                    ))}
                  </div>

                  {/* Show more hint */}
                  {hasMore && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => handleViewAll(category.name)}
                        className="text-sm text-[#c9a84c] font-semibold hover:underline"
                      >
                        + {items.length - preview.length} more in {category.name}
                      </button>
                    </div>
                  )}
                </section>
              );
            })
          )}
        </main>
      )}

    </div>
  );
};

export default Home;
