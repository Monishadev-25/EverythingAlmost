import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useCart } from '../context/CartContext';

export function Layout({ children }) {
  const { notification } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#241c18]">
      <Navbar />

      <main className="flex-1 w-full">{children}</main>

      <Footer />

      {/* Floating Add-to-Cart Toast */}
      {notification && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#241a15] text-[#fbf6f0] px-4 py-3 rounded-2xl shadow-2xl border border-[#4a392e] flex items-center gap-3 animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-[#c59b6d] shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-white">{notification.message}</p>
            <Link to="/cart" className="text-[#c59b6d] underline font-medium">
              View Cart & Checkout →
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
