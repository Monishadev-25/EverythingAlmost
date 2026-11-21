import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Gift, Heart, Sparkles, Star, Tag } from 'lucide-react';

export function ShopMegaMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const categories = [
    {
      name: 'Personalised Gifts',
      desc: 'Crystal photo blocks, engraved keepsakes & custom acrylics',
      path: '/shop?category=Personalised%20Gifts',
      badge: 'Popular',
    },
    {
      name: 'Candles & Home Fragrance',
      desc: 'Hand-poured soy wax candles, amber jars & calming scents',
      path: '/shop?category=Candles',
      badge: null,
    },
    {
      name: 'Christmas & Seasonal',
      desc: 'Holiday gift boxes, festive baubles & celebration sets',
      path: '/shop?category=Christmas',
      badge: 'Seasonal',
    },
    {
      name: 'Home & Living Decor',
      desc: 'Custom gold heart mugs, cozy throws & aesthetic tabletop',
      path: '/shop?category=Home%20%26%20Living',
      badge: null,
    },
    {
      name: 'Accessories & Jewelry',
      desc: 'Laser-engraved pet tags, keyrings & timeless bar necklaces',
      path: '/shop?category=Accessories',
      badge: null,
    },
    {
      name: 'Fashion & Cozy Wear',
      desc: 'Embroidered winter hoodies & organic cotton tote bags',
      path: '/shop?category=Fashion',
      badge: null,
    },
  ];

  const recipients = [
    { label: 'Gifts For Her', path: '/shop?category=For%20Her', hint: 'Jewelry, pamper hampers & scents' },
    { label: 'Gifts For Him', path: '/shop?category=For%20Him', hint: 'Leather accessories, watches & barware' },
    { label: 'Gifts For Couples', path: '/shop?category=Personalised%20Gifts', hint: 'Anniversary photo blocks & matching sets' },
    { label: 'For Pet Lovers', path: '/shop?category=Accessories', hint: 'Custom engraved paw tags & portraits' },
    { label: 'New Baby & Children', path: '/shop?category=Personalised%20Gifts', hint: 'Memory boxes & nursery keepsakes' },
  ];

  const occasions = [
    { label: 'Christmas Holidays', path: '/shop?category=Christmas' },
    { label: 'New Year Celebrations', path: '/shop?category=Christmas' },
    { label: 'Birthdays & Milestones', path: '/shop?category=Personalised%20Gifts' },
    { label: 'Anniversaries & Romance', path: '/shop?category=Personalised%20Gifts' },
    { label: 'Weddings & Engagements', path: '/shop?category=Home%20%26%20Living' },
    { label: 'Housewarming Wishes', path: '/shop?category=Candles' },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#faf7f2]/98 backdrop-blur-xl border-b border-[#ebdccd] shadow-2xl transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e9dcce]">
              <Gift className="w-4 h-4 text-[#784d2f]" />
              <h3 className="font-serif text-base text-[#241c18] font-semibold tracking-wide">
                Categories
              </h3>
            </div>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    onClick={onClose}
                    className="group block p-1.5 -mx-1.5 rounded-lg hover:bg-[#f2e6d7]/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#241c18] group-hover:text-[#784d2f] transition-colors">
                        {cat.name}
                      </span>
                      {cat.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#f2e2d0] text-[#784d2f]">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#857263] leading-snug line-clamp-1 mt-0.5">
                      {cat.desc}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Shop by Recipient */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e9dcce]">
              <Heart className="w-4 h-4 text-[#784d2f]" />
              <h3 className="font-serif text-base text-[#241c18] font-semibold tracking-wide">
                Shop By Recipient
              </h3>
            </div>
            <ul className="space-y-3">
              {recipients.map((rec) => (
                <li key={rec.label}>
                  <Link
                    to={rec.path}
                    onClick={onClose}
                    className="group block p-1.5 -mx-1.5 rounded-lg hover:bg-[#f2e6d7]/60 transition-colors"
                  >
                    <div className="text-xs font-medium text-[#382b22] group-hover:text-[#784d2f] transition-colors">
                      {rec.label}
                    </div>
                    <div className="text-[11px] text-[#8e7a6b]">{rec.hint}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shop by Occasion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e9dcce]">
              <Sparkles className="w-4 h-4 text-[#784d2f]" />
              <h3 className="font-serif text-base text-[#241c18] font-semibold tracking-wide">
                By Occasion
              </h3>
            </div>
            <ul className="space-y-2.5">
              {occasions.map((occ) => (
                <li key={occ.label}>
                  <Link
                    to={occ.path}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-xs text-[#4d3c31] hover:text-[#784d2f] py-1 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9ab92]"></span>
                    <span>{occ.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#784d2f] hover:underline"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 4: Curated Spotlight Card */}
          <div className="bg-[#f5ecdf] rounded-2xl p-5 border border-[#e5d4c1] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#784d2f]">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#784d2f]" />
                  <span>Bestseller Spotlight</span>
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px]">
                  £49.99
                </span>
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/70 shadow-sm relative group">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"
                  alt="Personalised 3D Crystal Photo Block"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <h4 className="font-serif text-sm font-semibold text-[#241c18]">
                  Personalised 3D Crystal Photo Block
                </h4>
                <p className="text-[11px] text-[#735e50] mt-1 leading-snug">
                  Precision sub-surface laser engraving preserving precious memories forever.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2d0be] mt-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6d4327] font-medium">
                <Tag className="w-3 h-3" />
                <span>10% OFF with code <strong>WELCOME</strong></span>
              </div>
              <Link
                to="/shop?category=Personalised%20Gifts"
                onClick={onClose}
                className="w-full bg-[#784d2f] hover:bg-[#623c22] text-white py-2 rounded-xl text-xs font-semibold tracking-wider text-center block transition-colors shadow-sm"
              >
                Shop Collection →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

