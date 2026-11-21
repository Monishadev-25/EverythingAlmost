import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, Lock, Mail, Package, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  AmexLogo,
  ApplePayLogo,
  ClearpayLogo,
  GooglePayLogo,
  KlarnaLogo,
  MastercardLogo,
  PayPalLogo,
  PayPalPayIn3Logo,
  VisaLogo,
} from './PaymentLogos';

export function Footer() {
  const { isSuperAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#241a15] text-[#e8dbcc] border-t border-[#3d2e25]">
      {/* Trust Badges Strip */}
      <div className="border-b border-[#362720] bg-[#1d1511]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="p-2.5 rounded-full bg-[#35251d] text-[#c59b6d]">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Free UK Delivery</h4>
                <p className="text-xs text-[#ad9885]">On all orders over £50</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="p-2.5 rounded-full bg-[#35251d] text-[#c59b6d]">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Handcrafted with Love</h4>
                <p className="text-xs text-[#ad9885]">Personalised in Britain</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="p-2.5 rounded-full bg-[#35251d] text-[#c59b6d]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Checkout</h4>
                <p className="text-xs text-[#ad9885]">Encrypted 256-bit payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="p-2.5 rounded-full bg-[#35251d] text-[#c59b6d]">
                <Heart className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Happiness</h4>
                <p className="text-xs text-[#ad9885]">Guaranteed delight or returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block text-white leading-[1.05]">
              <span className="font-serif text-3xl tracking-wide font-normal block">
                Everything
              </span>
              <span className="font-serif text-3xl tracking-wide font-normal block">
                Almost
              </span>
            </Link>
            <p className="text-sm text-[#b8a491] leading-relaxed max-w-sm">
              Discover our curated collection of beautiful, heartfelt gifts crafted for the moments and people who matter most. Thoughtfully designed, perfectly packaged.
            </p>
            <div className="pt-2 text-xs text-[#9d8977] space-y-1">
              <p>📍 London • United Kingdom</p>
              <p>✉️ support@everythingalmost.co.uk</p>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4 tracking-wide">Collections</h4>
            <ul className="space-y-2.5 text-sm text-[#b8a491]">
              <li>
                <Link to="/shop?category=Personalised%20Gifts" className="hover:text-[#c59b6d] transition-colors">
                  Personalised Gifts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Candles" className="hover:text-[#c59b6d] transition-colors">
                  Aromatherapy Candles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Christmas" className="hover:text-[#c59b6d] transition-colors">
                  Christmas Gift Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home%20%26%20Living" className="hover:text-[#c59b6d] transition-colors">
                  Home & Living Decor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-[#c59b6d] transition-colors">
                  Bespoke Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion" className="hover:text-[#c59b6d] transition-colors">
                  Cozy Winter Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4 tracking-wide">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-[#b8a491]">
              <li>
                <Link to="/account?tab=orders" className="hover:text-[#c59b6d] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#c59b6d] transition-colors">
                  View Cart & Checkout
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#c59b6d] transition-colors">
                  Delivery & Shipping
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#c59b6d] transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#c59b6d] transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#c59b6d] transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#c59b6d] transition-colors">
                  My Account
                </Link>
              </li>
              {isSuperAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-[#c59b6d] hover:underline font-semibold flex items-center gap-1.5 pt-1"
                  >
                    <span>Store Admin Portal</span>
                    <span className="text-[10px] bg-[#3e2c21] px-1.5 py-0.5 rounded text-[#e0c4a4]">
                      Superadmin
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-white mb-2 tracking-wide">Join Our Circle</h4>
            <p className="text-xs text-[#b8a491] mb-4 leading-relaxed">
              Enjoy 10% off your first order with code <span className="text-[#c59b6d] font-semibold">WELCOME</span>, plus early access to limited holiday editions.
            </p>

            {subscribed ? (
              <div className="bg-[#33241b] border border-[#543b2d] rounded-lg p-3 text-xs text-[#e5c59f] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#c59b6d] shrink-0" />
                <span>Thank you! Use code <strong>WELCOME</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a7664] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#1b130f] border border-[#3e2c22] rounded-lg py-2.5 pl-9 pr-3 text-xs text-white placeholder-[#786454] focus:outline-none focus:border-[#c59b6d]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c59b6d] hover:bg-[#b58a5b] text-[#241a15] font-semibold py-2 px-4 rounded-lg text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Accepted Payment Methods Strip */}
      <div className="border-t border-[#31231a] bg-[#1d1410] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#c59b6d]">
              Accepted Payment Methods
            </span>
            <p className="text-xs text-[#a6927f]">
              Debit/Credit Cards • Express Wallets • Flexible Buy Now, Pay Later (UK & International)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Cards */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#271b15] border border-[#3d2c22]" title="Debit & Credit Cards: Visa, Mastercard, American Express">
              <VisaLogo className="h-6 w-9 rounded" />
              <MastercardLogo className="h-6 w-9 rounded" />
              <AmexLogo className="h-6 w-9 rounded" />
            </div>

            {/* Wallets */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#271b15] border border-[#3d2c22]" title="Digital Wallets: Apple Pay, Google Pay, PayPal">
              <ApplePayLogo className="h-6 w-9 rounded" />
              <GooglePayLogo className="h-6 w-9 rounded" />
              <PayPalLogo className="h-6 w-9 rounded" />
            </div>

            {/* BNPL */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#271b15] border border-[#3d2c22]" title="Buy Now, Pay Later: Klarna, Clearpay, PayPal Pay in 3">
              <KlarnaLogo className="h-6 w-9 rounded" />
              <ClearpayLogo className="h-6 w-9 rounded" />
              <PayPalPayIn3Logo className="h-6 w-9 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-[#2a1c15] bg-[#140e0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7968]">
          <p>© {new Date().getFullYear()} Everything Almost Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] tracking-wide">
            <span className="hover:text-[#c59b6d] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#c59b6d] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#c59b6d] cursor-pointer">Cookie Preferences</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#c59b6d]">
            <Lock className="w-3.5 h-3.5 text-[#2b6b25]" />
            <span>256-Bit SSL Encrypted • PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

