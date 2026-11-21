import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { fetchMyOrders } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function AccountPage() {
  const { user, isSuperAdmin, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const notice = location.state?.notice;

  const activeTab = searchParams.get('tab') || 'orders';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {notice && (
        <div className="bg-[#fef4e8] border border-[#f5d5b3] text-[#784d2f] p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Notice:</span>
            <span>{notice}</span>
          </div>
        </div>
      )}

      {/* Account Header */}
      <div className="bg-[#fbf5ed] border border-[#ecd9c7] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#784d2f] text-white flex items-center justify-center font-serif text-2xl font-normal shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#241c18] font-normal">
                Hello, {user?.name || 'Valued Guest'}
              </h1>
              <span className="bg-[#ebd6c3] text-[#71462a] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                {isSuperAdmin ? 'Superadmin' : 'Member'}
              </span>
            </div>
            <p className="text-xs text-[#735e50] mt-0.5">{user?.email || 'guest@everythingalmost.co.uk'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin panel button ONLY visible to Superadmin */}
          {isSuperAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-[#784d2f] hover:bg-[#623c22] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Superadmin Control Center</span>
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 border border-[#d8c3b0] hover:bg-[#ebd9c7] text-[#543d2f] px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e5d4c2] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('wishlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-sm text-[#784d2f]">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-10 text-center space-y-4">
              <Package className="w-10 h-10 text-[#a38b78] mx-auto stroke-[1.4]" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#241c18]">No orders placed yet</h3>
                <p className="text-xs text-[#735e50]">
                  When you place an order for personalised gifts or candles, you can track its delivery status here.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-block bg-[#784d2f] hover:bg-[#623c22] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.order_number || order.id}
                  className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0e4d7] pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#8a7261]">
                        Order Number
                      </span>
                      <h4 className="font-mono text-sm font-bold text-[#241c18]">
                        #{order.order_number}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-[#8a7261]">
                        Date Placed
                      </span>
                      <p className="text-xs text-[#3d2e25]">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>

                    <div>
                      <span className="inline-block bg-[#eef6ed] border border-[#c4e3bf] text-[#2c6e26] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        {order.status || 'Processing'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-[#8a7261]">
                        Total Amount
                      </span>
                      <p className="font-serif text-base font-bold text-[#784d2f]">
                        £{Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items list in this order */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#735e50]">
                        Items ({order.items.length})
                      </p>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-[#f7efe4] p-2.5 rounded-xl border border-[#ecd9c7]"
                          >
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-[#241c18] truncate">
                                {item.product_name}
                              </p>
                              <p className="text-[11px] text-[#785f4f]">
                                Qty: {item.quantity} • £{Number(item.price).toFixed(2)}
                              </p>
                              {item.customization && Object.keys(item.customization).length > 0 && (
                                <div className="mt-1 pt-1 border-t border-[#ecd9c7] text-[10px] text-[#5c4637] space-y-0.5">
                                  {Object.entries(item.customization).map(([k, v]) => (
                                    <div key={k} className="truncate">
                                      <span className="font-semibold">{k}:</span>{' '}
                                      {typeof v === 'object' && v?.url ? (
                                        <a
                                          href={v.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[#784d2f] underline inline-block"
                                        >
                                          View photo ↗
                                        </a>
                                      ) : (
                                        <span>{String(v)}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1 text-xs text-[#735e50] flex items-center justify-between">
                    <span>
                      Delivery: <strong>{order.shipping_address}, {order.city}</strong>
                    </span>
                    <span className="text-[#8a5734] font-medium">
                      Estimated delivery: 2–3 business days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-10 text-center space-y-4">
              <Heart className="w-10 h-10 text-[#a38b78] mx-auto stroke-[1.4]" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#241c18]">Your wishlist is empty</h3>
                <p className="text-xs text-[#735e50]">
                  Save your favorite keepsakes, candles, and gifts to review or buy later.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-block bg-[#784d2f] hover:bg-[#623c22] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm"
              >
                Browse the Collection →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-3.5 flex flex-col justify-between"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow-sm text-xs cursor-pointer hover:bg-white"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-[#241c18] line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-[#784d2f] mb-3">
                      £{Number(item.price).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      className="w-full bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#3e2d23] border border-[#dfcebd] py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3">
            <h3 className="font-serif text-xl text-[#241c18]">Default Shipping Address</h3>
            <span className="text-xs bg-[#ebd6c3] text-[#71462a] px-2.5 py-0.5 rounded-full font-semibold">
              Primary
            </span>
          </div>
          <div className="text-xs text-[#523e32] space-y-1 leading-relaxed">
            <p className="font-bold text-sm text-[#241c18]">{user?.name || 'Customer'}</p>
            <p>42 Kensington High Street</p>
            <p>Apartment 3B</p>
            <p>London, W8 4PE</p>
            <p>United Kingdom</p>
            <p className="pt-2 text-[#735e50]">Phone: +44 (0)20 7946 0912</p>
          </div>
          <div className="pt-3">
            <button
              type="button"
              className="text-xs bg-[#f4ebe0] hover:bg-[#ebd9c7] text-[#543d2f] border border-[#dfcebd] px-4 py-2 rounded-xl font-medium cursor-pointer"
            >
              Edit Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

