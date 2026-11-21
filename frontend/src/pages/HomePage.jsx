import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Flame,
  Gem,
  Gift,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  Coffee,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchFeaturedProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import heroBanner from '../assets/hero-banner.webp';

const CATEGORY_PILLS = [
  { name: 'Gifts', category: 'Personalised Gifts', icon: Gift },
  { name: 'Home & Living', category: 'Home & Living', icon: Coffee },
  { name: 'Candles', category: 'Candles', icon: Flame },
  { name: 'Christmas', category: 'Christmas', icon: Star },
  { name: 'Fashion', category: 'Fashion', icon: Gem },
  { name: 'Accessories', category: 'Accessories', icon: ShoppingBag },
  { name: 'Personalised', category: 'Personalised Gifts', icon: Heart },
];

const CURATED_TILES = [
  {
    name: 'Cozy Vibes',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'For Her',
    category: 'For Her',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'For Him',
    category: 'For Him',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Self Care',
    category: 'Personalised Gifts',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Christmas Magic',
    category: 'Christmas',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchFeaturedProducts(controller.signal)
      .then((data) => setFeaturedProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#e5d2bf] min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Full-width Panoramic Background Image (No Overlay) */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Make Christmas More Special - Luxury Holiday Gift with Satin Ribbon"
            className="w-full h-full object-cover object-right lg:object-center"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-2 text-xs sm:text-[13px] tracking-[0.2em] font-medium text-[#7d5638] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#8a5734]" />
              <span>Gifts that last a lifetime</span>
              <span className="w-12 h-px bg-[#8a5734]/40" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#241c18] font-normal leading-[1.08] tracking-tight">
              Make Christmas <br />
              <span className="italic font-normal">More Special</span>
            </h1>

            <p className="text-[#594639] text-base sm:text-lg max-w-md font-light leading-relaxed">
              Thoughtful gifts for the people who matter most. Discover bespoke keepsakes, glowing candles, and festive holiday hampers crafted with care.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="bg-[#784d2f] hover:bg-[#623c22] text-white px-7 py-3 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Slider Dots Indicator */}
            <div className="pt-6 flex items-center gap-2 text-[#7d5638]">
              <button
                type="button"
                className="p-1 hover:text-[#241c18] transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-[#784d2f]" />
              <span className="w-2 h-2 rounded-full bg-[#784d2f]/30" />
              <button
                type="button"
                className="p-1 hover:text-[#241c18] transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CIRCULAR CATEGORY PILLS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 sm:gap-6 text-center">
          {CATEGORY_PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.name}
                type="button"
                onClick={() => navigate(`/shop?category=${encodeURIComponent(pill.category)}`)}
                className="group flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f3e7d8] border border-[#e5d4c1] flex items-center justify-center text-[#6e462a] group-hover:bg-[#784d2f] group-hover:text-white group-hover:scale-105 group-hover:border-[#784d2f] transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6 stroke-[1.6]" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium text-[#46382f] group-hover:text-[#784d2f] transition-colors">
                  {pill.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TWO PROMO BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Candles */}
          <div className="relative rounded-3xl overflow-hidden bg-[#e8dbcc] border border-[#dccebf] p-8 sm:p-10 flex flex-col justify-between min-h-[260px] group shadow-sm">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80"
                alt="Light Up The Season"
                className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a1d17]/80 via-[#2a1d17]/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-xs space-y-2 text-white">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                Light Up <br />
                The Season
              </h2>
              <p className="text-xs sm:text-sm text-[#f0e4d7]">
                Premium Candles & Home Decor crafted with natural waxes.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                to="/shop?category=Candles"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white tracking-wider underline hover:text-[#d6a775] transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Bestsellers */}
          <div className="relative rounded-3xl overflow-hidden bg-[#e8dbcc] border border-[#dccebf] p-8 sm:p-10 flex flex-col justify-between min-h-[260px] group shadow-sm">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80"
                alt="Perfect Gifts for Every Occasion"
                className="w-full h-full object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#38261e]/80 via-[#38261e]/45 to-transparent" />
            </div>

            <div className="relative z-10 max-w-xs space-y-2 text-white">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                Perfect Gifts <br />
                for Every Occasion
              </h2>
              <p className="text-xs sm:text-sm text-[#f0e4d7]">
                Thoughtful, Personal, Timeless. Made for celebrating joy.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                to="/shop?filter=bestsellers"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white tracking-wider underline hover:text-[#d6a775] transition-colors"
              >
                <span>Shop Bestsellers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED WITH LOVE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[#784d2f]">
            <span className="w-16 h-px bg-[#c9b4a1]" />
            <h2 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal tracking-wide">
              Curated with Love
            </h2>
            <span className="w-16 h-px bg-[#c9b4a1]" />
          </div>
          <p className="text-xs sm:text-sm text-[#665345]">
            Handpicked collections for every personality and festive mood.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {CURATED_TILES.map((tile) => (
            <button
              key={tile.name}
              type="button"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(tile.category)}`)}
              className="group relative rounded-2xl overflow-hidden bg-[#f4ece1] border border-[#e6d8c7] aspect-[4/5] flex flex-col justify-end p-4 text-center cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={tile.image}
                alt={tile.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261c17]/80 via-[#261c17]/30 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block bg-white/90 backdrop-blur-sm text-[#3b2b22] px-3 py-1 rounded-full text-xs font-medium tracking-wide shadow-sm group-hover:bg-[#784d2f] group-hover:text-white transition-colors">
                  {tile.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-[#ebdccd] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal">
              Trending Gifts
            </h2>
            <p className="text-xs sm:text-sm text-[#665345]">
              Loved by our customers across the UK.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-medium text-[#784d2f] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#784d2f]">Loading gifts...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. BOTTOM NEW YEAR BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#ebd6c3] via-[#f2e2d2] to-[#e4cfba] border border-[#d6beaa] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs tracking-widest text-[#784d2f] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Looking ahead</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal leading-tight">
              Celebrate the New Year <br />
              <span className="italic">with New Hopes</span>
            </h2>
            <p className="text-sm text-[#5f4c3f] font-light">
              Stylish gifts, bespoke diaries, and celebratory hampers to welcome new beginnings with elegance.
            </p>
          </div>

          <Link
            to="/shop?category=Christmas"
            className="bg-white hover:bg-[#faf7f2] text-[#241c18] border border-[#d6beaa] px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            Explore New Arrivals →
          </Link>
        </div>
      </section>
    </div>
  );
}
