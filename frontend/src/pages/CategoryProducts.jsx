import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API_ENDPOINTS } from '../config';
import { Loader2 } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'discount',   label: 'Discount' },
  { value: 'price_asc',  label: 'Price low to high' },
  { value: 'price_desc', label: 'Price high to low' },
];

const PRICE_BAND_COUNT = 5;

function buildPriceBands(products) {
  if (!products.length) return [];
  const prices = products.map(p => parseFloat(p.price));
  const min = Math.floor(Math.min(...prices) / 10) * 10;
  const max = Math.ceil(Math.max(...prices) / 10) * 10;
  if (min === max) return [];
  const step = Math.ceil((max - min) / PRICE_BAND_COUNT / 10) * 10;
  const bands = [];
  for (let i = 0; i < PRICE_BAND_COUNT; i++) {
    const lo = min + i * step;
    const hi = lo + step;
    if (lo >= max) break;
    bands.push({ lo, hi, label: `₹${lo.toLocaleString('en-IN')} - ₹${hi.toLocaleString('en-IN')}` });
  }
  return bands;
}

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(categoryName);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedBands, setSelectedBands] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false); // mobile

  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(r => r.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(p => {
              const cat = p.categoryId?.name || '';
              return cat.toLowerCase() === decodedName.toLowerCase();
            })
          : [];
        setAllProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [decodedName]);

  const priceBands = useMemo(() => buildPriceBands(allProducts), [allProducts]);

  const toggleBand = (band) => {
    setSelectedBands(prev =>
      prev.includes(band) ? prev.filter(b => b !== band) : [...prev, band]
    );
  };

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    if (selectedBands.length > 0) {
      list = list.filter(p => {
        const price = parseFloat(p.price);
        return selectedBands.some(b => price >= b.lo && price < b.hi);
      });
    }
    switch (sortBy) {
      case 'discount':
        return list.sort((a, b) => {
          const da = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const db = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return db - da;
        });
      case 'price_asc':  return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      default:           return list;
    }
  }, [allProducts, selectedBands, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label;

  const Sidebar = () => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 min-w-[180px]">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-gray-900 text-sm">Filters</span>
        {selectedBands.length > 0 && (
          <button onClick={() => setSelectedBands([])} className="text-xs text-red-500 font-semibold hover:underline">
            Clear all
          </button>
        )}
      </div>

      {priceBands.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Price</p>
          <div className="flex flex-col gap-2.5">
            {priceBands.map(band => (
              <label key={band.label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBands.includes(band)}
                  onChange={() => toggleBand(band)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#c9a84c] cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {band.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">

      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-[#c9a84c] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-gray-900 uppercase tracking-wide">
                {decodedName}
              </h1>
              {!loading && (
                <span className="text-sm text-gray-400 font-medium">({filteredProducts.length} items)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600"
              >
                Sort by{' '}
                <span className="text-[#c9a84c] flex items-center gap-0.5">
                  {activeSortLabel} <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sortBy === opt.value ? 'border-[#c9a84c]' : 'border-gray-300'}`}>
                          {sortBy === opt.value && <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />}
                        </span>
                        <span className={sortBy === opt.value ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2.5 text-xs text-gray-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-[#c9a84c] transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold uppercase">{decodedName}</span>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-48 shrink-0 self-start sticky top-[73px]">
          <Sidebar />
        </aside>

        {/* Products grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-[#c9a84c] w-10 h-10" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1">Try adjusting the filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <Sidebar />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full bg-[#c9a84c] text-white font-bold py-3 rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
