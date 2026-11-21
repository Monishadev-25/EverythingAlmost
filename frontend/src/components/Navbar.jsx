import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShopMegaMenu } from './ShopMegaMenu';

export function Navbar() {
  const { isAuthenticated, isSuperAdmin, user } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-[13px] tracking-wide transition-colors py-1 flex items-center gap-1 ${
      isActive
        ? 'text-[#8a5734] font-semibold border-b border-[#8a5734]'
        : 'text-[#4a3b32] hover:text-[#8a5734]'
    }`;

  const mobileCategories = [
    { label: 'All Products', path: '/shop' },
    { label: 'Personalised Gifts', path: '/shop?category=Personalised%20Gifts' },
    { label: 'Candles & Scents', path: '/shop?category=Candles' },
    { label: 'Christmas & Seasonal', path: '/shop?category=Christmas' },
    { label: 'Home & Living', path: '/shop?category=Home%20%26%20Living' },
    { label: 'Accessories', path: '/shop?category=Accessories' },
    { label: 'Fashion', path: '/shop?category=Fashion' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#ebdccd]">
      {/* Top Announcement Ribbon */}
      <div className="bg-[#f2e6d8] border-b border-[#e4d3c0] text-[#71462a] text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <span>✨</span>
        <span>Free UK Delivery on Orders Over £50</span>
        <span className="opacity-40">|</span>
        <span>Personalise Your Perfect Gift</span>
        <span>✨</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="p-1.5 text-[#3a2e26] hover:text-[#8a5734] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo - Stacked Serif */}
        <Link to="/" className="group flex flex-col leading-[1.05] text-[#241c18] select-none shrink-0">
          <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.04em] font-normal group-hover:text-[#8a5734] transition-colors">
            Everything
          </span>
          <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.04em] font-normal group-hover:text-[#8a5734] transition-colors">
            Almost
          </span>
        </Link>

        {/* Center Desktop Navigation: Home, Shop (with Mega Menu), About, Contact */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {/* Shop Nav with Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <NavLink
              to="/shop"
              className={navLinkClass}
              onClick={() => setMegaMenuOpen(false)}
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  megaMenuOpen ? 'rotate-180 text-[#8a5734]' : 'text-[#8a7261]'
                }`}
              />
            </NavLink>
          </div>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Icon Actions */}
        <div className="shrink-0 flex items-center gap-2.5 sm:gap-4 text-[#3a2e26]">
          {/* Admin Portal Shortcut — ONLY visible to Superadmin */}
          {isSuperAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 bg-[#f3e6d7] hover:bg-[#ebd8c4] border border-[#e2d0bd] text-[#6e462a] text-xs font-semibold px-2.5 py-1 rounded-full transition-colors shadow-sm"
              title="Superadmin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#784d2f]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search"
            className="p-1.5 hover:text-[#8a5734] transition-colors cursor-pointer"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 stroke-[1.6]" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/account?tab=wishlist"
            aria-label="Wishlist"
            className="p-1.5 hover:text-[#8a5734] transition-colors relative"
          >
            <Heart className="w-5 h-5 stroke-[1.6]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8a5734] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account / User Link */}
          <Link
            to={isAuthenticated ? '/account' : '/signin'}
            aria-label="Account"
            className="p-1.5 hover:text-[#8a5734] transition-colors flex items-center gap-1.5"
          >
            <User className="w-5 h-5 stroke-[1.6]" />
            {isAuthenticated && (
              <span className="hidden xl:inline text-xs font-medium text-[#71462a]">
                {user?.name?.split(' ')[0]}
              </span>
            )}
          </Link>

          {/* Cart Bag Icon with Count */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="p-1.5 hover:text-[#8a5734] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
            <span className="absolute -top-1 -right-1 bg-[#241c18] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-semibold">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop Shop Mega Menu Overlay */}
      <ShopMegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
      />

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-[#ebdccd] bg-[#fbf8f3] px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-[#8a5734]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts, candles, crystal blocks, accessories..."
              autoFocus
              className="w-full bg-transparent text-sm text-[#241c18] placeholder-[#947e6e] outline-none"
            />
            <button
              type="submit"
              className="text-xs bg-[#8a5734] text-white px-3.5 py-1.5 rounded-full font-medium hover:bg-[#724527] transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs text-[#71462a] hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ebdccd] bg-[#faf7f2] px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#241c18] hover:text-[#8a5734] py-1 border-b border-[#f0e4d7]"
            >
              Home
            </Link>

            {/* Mobile Shop Accordion */}
            <div>
              <div
                onClick={() => setMobileShopExpanded((prev) => !prev)}
                className="flex items-center justify-between text-sm font-medium text-[#241c18] hover:text-[#8a5734] py-1 border-b border-[#f0e4d7] cursor-pointer"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileShopExpanded ? 'rotate-180 text-[#8a5734]' : ''
                  }`}
                />
              </div>

              {mobileShopExpanded && (
                <div className="pl-4 py-2 space-y-2 border-l-2 border-[#ebdccd] my-2 bg-[#f4ebe0]/40 rounded-r-xl">
                  {mobileCategories.map((c) => (
                    <Link
                      key={c.label}
                      to={c.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-[#5e4b3e] hover:text-[#8a5734] py-1"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#241c18] hover:text-[#8a5734] py-1 border-b border-[#f0e4d7]"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#241c18] hover:text-[#8a5734] py-1 border-b border-[#f0e4d7]"
            >
              Contact
            </Link>

            {/* Admin Portal in Mobile Menu ONLY for Superadmin */}
            {isSuperAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#784d2f] bg-[#f2e2d0] px-3 py-2 rounded-xl mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Superadmin Control Center</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
