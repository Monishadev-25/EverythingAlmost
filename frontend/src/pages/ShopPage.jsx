import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Filter,
  Grid,
  List,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { fetchCategories, fetchProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active filters from query params
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [maxPrice, setMaxPrice] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [preOrderOnly, setPreOrderOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  // Sync category state when URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products with active filters
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchProducts(
      {
        category: selectedCategory,
        max_price: maxPrice < 100 ? maxPrice : undefined,
        in_stock: inStockOnly ? true : undefined,
        q: searchQuery,
        sort: sortBy,
      },
      controller.signal
    )
      .then((data) => {
        let list = data;
        if (filterParam === 'bestsellers') {
          list = list.filter((p) => p.is_bestseller);
        }
        setProducts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selectedCategory, maxPrice, inStockOnly, searchQuery, sortBy, filterParam]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const next = new URLSearchParams(searchParams);
    if (catName === 'All') {
      next.delete('category');
    } else {
      next.set('category', catName);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(100);
    setInStockOnly(false);
    setPreOrderOnly(false);
    setSortBy('popular');
    const next = new URLSearchParams();
    setSearchParams(next);
  };

  // Pagination simulation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage]);

  const visibleCategories = showMoreCategories
    ? categories
    : categories.slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* 1. SHOP HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbf4eb] via-[#f7ebdc] to-[#eee0cf] border-b border-[#e5d4c2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5734]">
              Shop All
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#241c18] font-normal leading-tight">
              Thoughtful Gifts <br />
              <span className="italic">for Every Moment</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5c493c] font-light max-w-xl">
              Discover our curated collection of beautiful and meaningful gifts crafted to make life’s milestones truly unforgettable.
            </p>
          </div>

          <div className="md:col-span-4 hidden md:flex justify-end">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white/70">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80"
                alt="Curated gifts"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex items-center justify-between pb-2 border-b border-[#ebdccd]">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 bg-[#f4ece1] px-4 py-2 rounded-xl text-xs font-medium text-[#463529] border border-[#e0cfbe]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter By</span>
            </button>
            <span className="text-xs text-[#735e50]">
              {products.length} products
            </span>
          </div>

          {/* LEFT SIDEBAR: FILTERS */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#faf7f2] p-6 shadow-2xl lg:shadow-none lg:p-0 lg:w-64 lg:static lg:block transition-transform duration-300 ${
              mobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between lg:hidden mb-6 pb-2 border-b border-[#e5d4c2]">
              <h2 className="font-serif text-lg font-bold text-[#241c18]">Filter By</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#463529]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header with Reset */}
              <div className="hidden lg:flex items-center justify-between border-b border-[#ebdccd] pb-3">
                <h2 className="font-serif text-xl font-normal text-[#241c18]">Filter By</h2>
                {(selectedCategory !== 'All' || maxPrice < 100 || inStockOnly || searchQuery) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-medium text-[#8a5734] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5840]">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-[#3b2e25] cursor-pointer hover:text-[#8a5734]">
                    <input
                      type="radio"
                      name="shopCategory"
                      checked={selectedCategory === 'All'}
                      onChange={() => handleCategorySelect('All')}
                      className="accent-[#8a5734] w-3.5 h-3.5"
                    />
                    <span>All Collections</span>
                  </label>

                  {visibleCategories.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex items-center justify-between text-xs text-[#3b2e25] cursor-pointer hover:text-[#8a5734]"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shopCategory"
                          checked={selectedCategory === cat.name}
                          onChange={() => handleCategorySelect(cat.name)}
                          className="accent-[#8a5734] w-3.5 h-3.5"
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-[#9c897a]">({cat.count})</span>
                    </label>
                  ))}
                </div>

                {categories.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowMoreCategories((p) => !p)}
                    className="text-xs font-medium text-[#8a5734] hover:underline pt-1 cursor-pointer"
                  >
                    {showMoreCategories ? '- Show less' : '+ Show more'}
                  </button>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3 pt-3 border-t border-[#ebdccd]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5840]">
                    Price Range
                  </h3>
                  <span className="text-xs font-semibold text-[#241c18]">
                    £0 – £{maxPrice}{maxPrice >= 100 ? '+' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8a5734] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#9c897a]">
                  <span>£0</span>
                  <span>£100+</span>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2 pt-3 border-t border-[#ebdccd]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5840]">
                  Availability
                </h3>
                <label className="flex items-center justify-between text-xs text-[#3b2e25] cursor-pointer hover:text-[#8a5734]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-[#8a5734] rounded w-3.5 h-3.5"
                    />
                    <span>In Stock</span>
                  </div>
                  <span className="text-[11px] text-[#9c897a]">(72)</span>
                </label>
                <label className="flex items-center justify-between text-xs text-[#3b2e25] cursor-pointer hover:text-[#8a5734]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={preOrderOnly}
                      onChange={(e) => setPreOrderOnly(e.target.checked)}
                      className="accent-[#8a5734] rounded w-3.5 h-3.5"
                    />
                    <span>Pre-Order</span>
                  </div>
                  <span className="text-[11px] text-[#9c897a]">(8)</span>
                </label>
              </div>

              {/* SIDEBAR PROMO CARD (Matches the design image!) */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#8a5734] via-[#754425] to-[#593116] p-5 text-white text-center shadow-md space-y-3">
                <Sparkles className="w-5 h-5 mx-auto text-[#f2dac2]" />
                <h4 className="font-serif text-lg font-normal leading-snug">
                  Get 10% OFF <br />
                  Your First Order
                </h4>
                <div className="bg-[#4d2810] border border-[#a87a55]/40 py-1 px-2.5 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-[#f8e7d5]">
                  Use Code: WELCOME
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-[#f4ecdf] hover:bg-white text-[#3d2210] py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: PRODUCT GRID */}
          <main className="flex-1 w-full space-y-6">
            {/* Top Toolbar: Count + Sort + Grid/List View */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ebdccd]">
              <p className="text-xs sm:text-sm text-[#5f4c3f]">
                Showing <span className="font-semibold text-[#241c18]">{displayedProducts.length}</span> of{' '}
                <span className="font-semibold text-[#241c18]">{products.length}</span> products
              </p>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative flex items-center gap-2 text-xs">
                  <span className="text-[#6d5748] hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#f4ebe0] border border-[#dfcebd] rounded-xl px-3 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#8a5734] cursor-pointer"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                {/* Grid / List Mode */}
                <div className="flex items-center gap-1 bg-[#f4ebe0] p-1 rounded-xl border border-[#dfcebd]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-xs text-[#8a5734]' : 'text-[#6d5748]'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-[#8a5734]' : 'text-[#6d5748]'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            {loading ? (
              <div className="py-20 text-center text-sm text-[#8a5734]">
                Loading collection...
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-[#fdfaf5] rounded-3xl border border-[#ede3d7] p-8">
                <p className="font-serif text-xl text-[#241c18]">No products found</p>
                <p className="text-xs text-[#715c4d]">
                  Try clearing your search term or selecting a different price filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-[#8a5734] text-white px-4 py-2 rounded-xl text-xs font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#8a5734] text-white shadow-sm'
                          : 'bg-[#f4ebe0] text-[#423328] hover:bg-[#e8dbcc]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

