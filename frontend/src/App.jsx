import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SuperAdminRoute } from './components/RouteGuards';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { ShopPage } from './pages/ShopPage';
import { SigninPage } from './pages/SigninPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Layout>
              <Routes>
                {/* 1. Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Shop Page */}
                <Route path="/shop" element={<ShopPage />} />

                {/* 3. About Page */}
                <Route path="/about" element={<AboutPage />} />

                {/* 4. Contact Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* 5. Sign In Page (and /login alias) */}
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/login" element={<SigninPage />} />

                {/* 6. Register Page */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 7. Account Page */}
                <Route path="/account" element={<AccountPage />} />

                {/* 8. Cart Page */}
                <Route path="/cart" element={<CartPage />} />

                {/* 9. Checkout Page */}
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* 10. Superadmin Protected Admin Panel */}
                <Route
                  path="/admin"
                  element={
                    <SuperAdminRoute>
                      <AdminDashboardPage />
                    </SuperAdminRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
