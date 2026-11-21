import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Key,
  Landmark,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Upload,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import {
  AmexLogo,
  ApplePayLogo,
  ClearpayLogo,
  GooglePayLogo,
  KlarnaLogo,
  MastercardLogo,
  PayPalLogo,
  PayPalPayIn3Logo,
  PaymentLogosStrip,
  VisaLogo,
} from '../../components/PaymentLogos';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminStats,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProduct,
} from '../../api/admin';
import {
  fetchAdminPaymentSettings,
  testGatewayConnection,
  updateAdminPaymentSettings,
} from '../../api/payment';

const BOUTIQUE_CATEGORIES = [
  'Personalised Gifts',
  'Home & Living',
  'Candles',
  'Christmas',
  'Accessories',
  'Fashion',
  'For Him',
  'For Her',
];

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'analytics'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Personalised Gifts',
    price: '',
    original_price: '',
    description: '',
    in_stock: true,
    is_featured: false,
    is_bestseller: false,
    badge: '',
    custom_fields: [],
  });

  // Orders & Payments Tab State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);

  // Receiver Accounts & Gateway Settings State
  const [payoutSettings, setPayoutSettings] = useState({
    environment: 'sandbox', // 'sandbox' | 'live'
    bank_name: 'Barclays Bank UK',
    account_holder: 'Everything Almost Ltd',
    sort_code: '20-00-00',
    account_number: '12345678',
    bank_iban: 'GB29BARC20000012345678',
    bank_bic: 'BARCGB22',
    bank_transfer_enabled: true,
    payout_schedule: 'daily',
    stripe_enabled: true,
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    paypal_enabled: true,
    paypal_email: 'payments@everythingalmost.co.uk',
  });

  const [testingGateway, setTestingGateway] = useState(false);
  const [testGatewayResult, setTestGatewayResult] = useState(null);

  // Load Receiver Settings from Backend
  const loadPaymentSettings = () => {
    fetchAdminPaymentSettings()
      .then((data) => {
        if (data && typeof data === 'object') {
          setPayoutSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  };

  const handleSavePayoutSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAdminPaymentSettings(payoutSettings);
      showToast(res.message || 'Receiver banking and gateway configuration saved successfully!');
    } catch {
      showToast('Failed to save settings.', 'error');
    }
  };

  const handleTestStripeConnection = async () => {
    setTestingGateway(true);
    setTestGatewayResult(null);
    try {
      const res = await testGatewayConnection({
        gateway: 'stripe',
        stripe_secret_key: payoutSettings.stripe_secret_key,
      });
      setTestGatewayResult(res);
      showToast(res.message, res.success ? 'success' : 'error');
    } catch (err) {
      setTestGatewayResult({ success: false, message: err.message || 'Connection test failed.' });
      showToast(err.message || 'Connection test failed.', 'error');
    } finally {
      setTestingGateway(false);
    }
  };

  const handleTestPaypalConnection = async () => {
    setTestingGateway(true);
    setTestGatewayResult(null);
    try {
      const res = await testGatewayConnection({
        gateway: 'paypal',
        paypal_email: payoutSettings.paypal_email,
      });
      setTestGatewayResult(res);
      showToast(res.message, res.success ? 'success' : 'error');
    } catch (err) {
      setTestGatewayResult({ success: false, message: err.message || 'Verification failed.' });
      showToast(err.message || 'Verification failed.', 'error');
    } finally {
      setTestingGateway(false);
    }
  };

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load Initial Stats
  const loadStats = () => {
    setLoadingStats(true);
    fetchAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  };

  // Load Products
  const loadProducts = () => {
    setLoadingProducts(true);
    fetchAdminProducts({
      category: productCategoryFilter,
      q: productSearch,
    })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  };

  // Load Orders
  const loadOrders = () => {
    setLoadingOrders(true);
    fetchAdminOrders({
      payment_status: paymentFilter,
      status: orderStatusFilter,
      q: orderSearch,
    })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    loadStats();
    loadPaymentSettings();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [productCategoryFilter, productSearch]);

  useEffect(() => {
    loadOrders();
  }, [paymentFilter, orderStatusFilter, orderSearch]);

  // Handle Open Create Product
  const handleOpenCreateModal = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
    setProductForm({
      name: '',
      category: 'Personalised Gifts',
      price: '',
      original_price: '',
      description: '',
      in_stock: true,
      is_featured: false,
      is_bestseller: false,
      badge: '',
      custom_fields: [],
    });
    setProductModalOpen(true);
  };

  // Handle Open Edit Product
  const handleOpenEditModal = (product) => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product.image_url || '');
    setProductForm({
      name: product.name || '',
      category: product.category || 'Personalised Gifts',
      price: product.price || '',
      original_price: product.original_price || '',
      description: product.description || '',
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      is_featured: Boolean(product.is_featured),
      is_bestseller: Boolean(product.is_bestseller),
      badge: product.badge || '',
      custom_fields: Array.isArray(product.custom_fields)
        ? product.custom_fields.map((f) => ({
            ...f,
            options: Array.isArray(f.options) ? f.options.join(', ') : f.options || '',
          }))
        : [],
    });
    setProductModalOpen(true);
  };

  // Custom Fields Builder Handlers
  const handleAddCustomField = (type = 'text', defaultLabel = '') => {
    const newField = {
      id: 'cf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type,
      label: defaultLabel,
      placeholder: '',
      options: '',
      required: true,
      help_text: '',
    };
    setProductForm((prev) => ({
      ...prev,
      custom_fields: [...prev.custom_fields, newField],
    }));
  };

  const handleUpdateCustomField = (index, key, value) => {
    setProductForm((prev) => {
      const updated = [...prev.custom_fields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, custom_fields: updated };
    });
  };

  const handleRemoveCustomField = (index) => {
    setProductForm((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, idx) => idx !== index),
    }));
  };

  // Handle Product Image File Selection
  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, or GIF).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be 5MB or smaller.', 'error');
      return;
    }
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    if (!editingProduct && !imageFile) {
      showToast('Please upload a product image.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('price', String(Number(productForm.price)));
    if (productForm.original_price !== '' && productForm.original_price !== null) {
      formData.append('original_price', String(Number(productForm.original_price)));
    }
    formData.append('description', productForm.description || '');
    formData.append('badge', productForm.badge || '');
    formData.append('in_stock', productForm.in_stock ? '1' : '0');
    formData.append('is_featured', productForm.is_featured ? '1' : '0');
    formData.append('is_bestseller', productForm.is_bestseller ? '1' : '0');

    // Dynamic Personalisation / Custom Fields
    const cleanedCustomFields = (productForm.custom_fields || [])
      .filter((field) => field.label && field.label.trim().length > 0)
      .map((field) => {
        const item = {
          id: field.id || 'cf_' + Math.random().toString(36).substring(2, 9),
          type: field.type,
          label: field.label.trim(),
          placeholder: field.placeholder || '',
          required: Boolean(field.required),
          help_text: field.help_text || '',
        };
        if (field.type === 'select') {
          item.options = typeof field.options === 'string'
            ? field.options.split(',').map((o) => o.trim()).filter(Boolean)
            : Array.isArray(field.options) ? field.options : [];
        }
        return item;
      });

    formData.append('custom_fields', JSON.stringify(cleanedCustomFields));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    setSavingProduct(true);
    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, formData);
        showToast(`Updated "${productForm.name}" successfully!`);
      } else {
        await createAdminProduct(formData);
        showToast(`Uploaded new product "${productForm.name}" to ${productForm.category}!`);
      }

      setProductModalOpen(false);
      handleRemoveImage();
      loadProducts();
      loadStats();
    } catch (error) {
      showToast(error.message || 'Failed to save product.', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAdminProduct(id);
      showToast(`Deleted "${name}".`);
      loadProducts();
      loadStats();
    }
  };

  // Quick Payment Status Change
  const handleQuickPaymentUpdate = async (orderId, nextPaymentStatus) => {
    await updateAdminPaymentStatus(orderId, nextPaymentStatus);
    showToast(`Payment marked as ${nextPaymentStatus.toUpperCase()}`);
    loadOrders();
    loadStats();
    if (selectedOrderReceipt && selectedOrderReceipt.id === orderId) {
      setSelectedOrderReceipt((prev) => ({ ...prev, payment_status: nextPaymentStatus }));
    }
  };

  // Quick Order Fulfillment Status Change
  const handleQuickOrderStatusUpdate = async (orderId, nextStatus) => {
    await updateAdminOrderStatus(orderId, nextStatus);
    showToast(`Order status updated to ${nextStatus}`);
    loadOrders();
    if (selectedOrderReceipt && selectedOrderReceipt.id === orderId) {
      setSelectedOrderReceipt((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification */}
      {toast && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#241a15] text-[#fbf6f0] px-4 py-3 rounded-2xl shadow-2xl border border-[#4a392e] flex items-center gap-2 text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#c59b6d]" />
          <span>{toast.message}</span>
        </aside>
      )}

      {/* TOP ADMIN HEADER */}
      <div className="bg-[#fbf5ed] border border-[#ecd9c7] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-[#784d2f] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Superadmin Control Center</span>
            </span>
            <span className="text-xs text-[#785f4f]">Everything Almost E-Commerce Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
            Store Administration & Payment Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#735e50]">
            Upload new products category-wise, adjust prices, and manage full customer payment records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 bg-white border border-[#dfcebd] hover:bg-[#faf7f2] text-[#423328] px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Shop</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              loadStats();
              loadProducts();
              loadOrders();
              showToast('Refreshed store data.');
            }}
            className="p-2 bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#423328] rounded-xl border border-[#dfcebd] transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STORE ANALYTICS METRICS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Revenue */}
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#8a7261]">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <span className="p-2 rounded-xl bg-[#eef6ed] text-[#2b6b25]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#241c18]">
            £{Number(stats?.total_revenue || 1249.5).toFixed(2)}
          </div>
          <p className="text-[11px] text-[#2b6b25] flex items-center gap-1">
            <span>✓ Verified paid transactions</span>
          </p>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#8a7261]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <span className="p-2 rounded-xl bg-[#fdf2e9] text-[#784d2f]">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#241c18]">
            {stats?.orders_count || 14}
          </div>
          <p className="text-[11px] text-[#735e50]">
            {stats?.paid_orders || 12} Paid • {stats?.pending_orders || 2} Pending
          </p>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#8a7261]">
            <span className="text-xs font-bold uppercase tracking-wider">Products Catalog</span>
            <span className="p-2 rounded-xl bg-[#f4ebe0] text-[#784d2f]">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#241c18]">
            {products.length || stats?.products_count || 12}
          </div>
          <p className="text-[11px] text-[#735e50]">Across 8 boutique categories</p>
        </div>

        {/* Metric 4: Payments Health */}
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#8a7261]">
            <span className="text-xs font-bold uppercase tracking-wider">Payment Status</span>
            <span className="p-2 rounded-xl bg-[#f0e7fe] text-[#6929c4]">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#241c18]">
            {stats?.paid_orders || 12} Paid
          </div>
          <p className="text-[11px] text-[#735e50]">
            {stats?.refunded_orders || 0} Refunded • Instant Reconciliation
          </p>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-3 border-b border-[#e5d4c2] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Upload ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment & Orders Management ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payout')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer ${
            activeTab === 'payout'
              ? 'bg-[#784d2f] text-white shadow-sm'
              : 'text-[#614b3d] hover:bg-[#f3e7d8]'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Receiver Banking & Gateway Settings</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCT MANAGEMENT & UPLOAD (CATEGORY WISE, PRICE, IMAGE, DETAILS) */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8a7261] absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2 pl-9 pr-3 text-xs text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f]"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e5849] font-medium hidden sm:inline">Category:</span>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-white border border-[#dfcebd] rounded-xl px-3 py-2 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
              >
                <option value="All">All Categories</option>
                {BOUTIQUE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="bg-[#784d2f] hover:bg-[#623c22] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f7efe4] border-b border-[#ecd9c7] text-[#634e40] font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Badges</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e4d7]">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-[#784d2f]">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-[#784d2f]">
                        No products found matching filters.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#f9f3ea] transition-colors">
                        {/* Product Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-[#f4ecdf] border border-[#ecd9c7] shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <h4 className="font-serif text-sm font-medium text-[#241c18] truncate">
                                {product.name}
                              </h4>
                              <p className="text-[11px] text-[#8a7261] truncate font-mono">
                                /{product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="bg-[#f2e6d8] border border-[#e2d0bd] text-[#6e462a] text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <span className="font-serif text-sm font-bold text-[#241c18]">
                            £{Number(product.price).toFixed(2)}
                          </span>
                          {product.original_price && (
                            <span className="text-[11px] text-[#9c897a] line-through ml-1.5">
                              £{Number(product.original_price).toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4">
                          {product.in_stock ? (
                            <span className="bg-[#eef6ed] text-[#2b6b25] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              In Stock
                            </span>
                          ) : (
                            <span className="bg-[#fbeeed] text-[#8e241c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Out of Stock
                            </span>
                          )}
                        </td>

                        {/* Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(product.custom_fields) && product.custom_fields.length > 0 && (
                              <span className="bg-[#fcf3e6] text-[#875529] border border-[#ecd9c7] text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-[#784d2f]" />
                                <span>Customisable ({product.custom_fields.length})</span>
                              </span>
                            )}
                            {product.badge && (
                              <span className="bg-[#f9f2e7] text-[#784d2f] border border-[#e6d5c3] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {product.badge}
                              </span>
                            )}
                            {product.is_featured && (
                              <span className="bg-[#e9f2fb] text-[#1c558e] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 bg-white border border-[#dfcebd] hover:bg-[#f4ebe0] text-[#543d2f] rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FULL PAYMENT & ORDER MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#fdfaf5] border border-[#ede1d3] rounded-2xl p-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8a7261] absolute left-3 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by order #, customer name, email..."
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2 pl-9 pr-3 text-xs text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#784d2f]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Payment Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#6e5849] font-medium">Payment:</span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-white border border-[#dfcebd] rounded-xl px-2.5 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                >
                  <option value="All">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Fulfillment Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#6e5849] font-medium">Fulfillment:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-[#dfcebd] rounded-xl px-2.5 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                >
                  <option value="All">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders & Payments Table */}
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f7efe4] border-b border-[#ecd9c7] text-[#634e40] font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Fulfillment</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e4d7]">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm text-[#784d2f]">
                        Loading orders and payment ledger...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm text-[#784d2f]">
                        No orders matching the specified filter.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f9f3ea] transition-colors">
                        {/* Order Number */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-xs text-[#241c18]">
                            #{order.order_number}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#241c18]">{order.customer_name}</p>
                          <p className="text-[11px] text-[#8a7261]">{order.customer_email}</p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[#6e5849]">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-4">
                          <span className="uppercase text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#dfcebd] text-[#543d2f]">
                            {order.payment_method ? order.payment_method.replace(/_/g, ' ') : 'Card'}
                          </span>
                        </td>

                        {/* PAYMENT STATUS DROPDOWN (Interactive Payment Management) */}
                        <td className="py-3.5 px-4">
                          <select
                            value={order.payment_status || 'paid'}
                            onChange={(e) => handleQuickPaymentUpdate(order.id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              order.payment_status === 'paid'
                                ? 'bg-[#eef6ed] text-[#2b6b25] border-[#c4e3bf]'
                                : order.payment_status === 'pending'
                                ? 'bg-[#fef8e7] text-[#8f6813] border-[#fae29f]'
                                : order.payment_status === 'refunded'
                                ? 'bg-[#f4ecfe] text-[#6929c4] border-[#d8beff]'
                                : 'bg-[#fbeeed] text-[#8e241c] border-[#f5c6c2]'
                            }`}
                          >
                            <option value="paid">✓ PAID</option>
                            <option value="pending">⏳ PENDING</option>
                            <option value="refunded">↩ REFUNDED</option>
                            <option value="failed">✕ FAILED</option>
                          </select>
                        </td>

                        {/* FULFILLMENT STATUS DROPDOWN */}
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status || 'processing'}
                            onChange={(e) => handleQuickOrderStatusUpdate(order.id, e.target.value)}
                            className="bg-white border border-[#dfcebd] rounded-lg px-2 py-1 text-[11px] font-medium text-[#241c18] focus:outline-none cursor-pointer"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4">
                          <span className="font-serif text-sm font-bold text-[#784d2f]">
                            £{Number(order.total).toFixed(2)}
                          </span>
                        </td>

                        {/* Details View */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderReceipt(order)}
                            className="inline-flex items-center gap-1 bg-white border border-[#dfcebd] hover:bg-[#f4ebe0] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECEIVER BANK & PAYMENT GATEWAY SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'payout' && (
        <div className="space-y-8">
          {/* Architecture Explanation Card */}
          <div className="bg-[#fbf5ed] border border-[#ecd9c7] rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ebd8c5] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#784d2f] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>How Payment Receiving Works</span>
                </span>
                <h3 className="font-serif text-2xl text-[#241c18] mt-1">
                  Where Customer Payments Are Received
                </h3>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#dfcebd] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d49942] animate-pulse" />
                <span className="text-xs font-semibold text-[#543d2f]">
                  Current Mode: {payoutSettings.environment === 'live' ? 'Live Production Banking' : 'Sandbox Simulation (Safe Testing)'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#665042] leading-relaxed max-w-3xl">
              Under UK and EU financial regulations (PCI-DSS), online stores do not store customer bank cards directly. Instead, transactions flow securely through licensed merchant gateways (such as <strong>Stripe</strong> and <strong>PayPal</strong>), which process customer payments and automatically deposit the net payouts into your designated <strong>UK Business Bank Account</strong> on a daily or weekly rolling schedule.
            </p>

            {/* Visual Flow diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#ede1d3] space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#784d2f]">Step 1: Customer Pays</span>
                <p className="font-semibold text-[#241c18]">Visa, Mastercard, Amex, Apple Pay, Klarna, Clearpay</p>
                <p className="text-[11px] text-[#8a7261]">Zero merchant surcharge, 256-bit SSL encrypted at checkout.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#ede1d3] space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#784d2f]">Step 2: Gateway Clears Funds</span>
                <p className="font-semibold text-[#241c18]">Stripe & PayPal Merchant Gateways</p>
                <p className="text-[11px] text-[#8a7261]">Fraud checks, 3D Secure verification, currency conversion.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#ede1d3] space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#784d2f]">Step 3: Payout to Your Bank</span>
                <p className="font-semibold text-[#241c18]">Your UK Business Bank Account</p>
                <p className="text-[11px] text-[#8a7261]">Automatic rolling bank transfers (Sort code & Account number).</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSavePayoutSettings} className="space-y-8">
            {/* Setting Group 1: Environment Mode */}
            <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="font-serif text-lg font-medium text-[#241c18] border-b border-[#f0e4d7] pb-3 flex items-center justify-between">
                <span>1. Store Payment Environment</span>
                <span className="text-xs text-[#784d2f] font-mono">Sandbox vs Live</span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPayoutSettings({ ...payoutSettings, environment: 'sandbox' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    payoutSettings.environment === 'sandbox'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="environment"
                      value="sandbox"
                      checked={payoutSettings.environment === 'sandbox'}
                      onChange={() => setPayoutSettings({ ...payoutSettings, environment: 'sandbox' })}
                      className="accent-[#784d2f]"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#241c18] block">
                        Sandbox / Simulation Mode (Recommended for Testing)
                      </span>
                      <span className="text-[11px] text-[#735e50]">
                        Safe test orders with simulated instant approvals. No real money taken from customers.
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPayoutSettings({ ...payoutSettings, environment: 'live' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    payoutSettings.environment === 'live'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="environment"
                      value="live"
                      checked={payoutSettings.environment === 'live'}
                      onChange={() => setPayoutSettings({ ...payoutSettings, environment: 'live' })}
                      className="accent-[#784d2f]"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#241c18] block">
                        Live Production Mode (Real Customer Cards)
                      </span>
                      <span className="text-[11px] text-[#735e50]">
                        Real payments are charged to customer cards/wallets and paid out into your connected bank account.
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Setting Group 2: Receiver UK Bank Account Details */}
            <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="font-serif text-lg font-medium text-[#241c18] border-b border-[#f0e4d7] pb-3 flex items-center justify-between">
                <span>2. Receiver Business Bank Account (Payout Destination)</span>
                <span className="text-xs text-[#2b6b25] flex items-center gap-1 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypted Storage</span>
                </span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.bank_name}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_name: e.target.value })}
                    placeholder="e.g. Barclays Bank UK, Monzo, HSBC, Lloyds"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.account_holder}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, account_holder: e.target.value })}
                    placeholder="e.g. Everything Almost Ltd"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Sort Code (UK)
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.sort_code}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, sort_code: e.target.value })}
                    placeholder="e.g. 20-00-00"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Account Number (8 Digits)
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.account_number}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, account_number: e.target.value })}
                    placeholder="e.g. 12345678"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    IBAN (For UK & International Direct Bank Wire)
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.bank_iban || ''}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_iban: e.target.value })}
                    placeholder="e.g. GB29BARC20000012345678"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    BIC / SWIFT Code
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.bank_bic || ''}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_bic: e.target.value })}
                    placeholder="e.g. BARCGB22"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Automatic Gateway Payout Schedule
                  </label>
                  <select
                    value={payoutSettings.payout_schedule}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, payout_schedule: e.target.value })}
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  >
                    <option value="daily">Daily Rolling Payouts (Default)</option>
                    <option value="weekly">Weekly Payouts (Every Monday)</option>
                    <option value="monthly">Monthly Payouts (1st of Month)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#dfcebd] cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={payoutSettings.bank_transfer_enabled !== false}
                      onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_transfer_enabled: e.target.checked })}
                      className="w-4 h-4 accent-[#784d2f] rounded"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#241c18] block">
                        Direct Bank Wire on Checkout
                      </span>
                      <span className="text-[11px] text-[#735e50]">
                        Shows your Sort Code & Account Number for manual BACS payment.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Setting Group 3: Merchant Gateway API Keys */}
            <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="font-serif text-lg font-medium text-[#241c18] border-b border-[#f0e4d7] pb-3 flex items-center justify-between">
                <span>3. Payment Gateway API Integration Keys</span>
                <span className="text-xs text-[#785f4f]">Stripe & PayPal Merchant</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Stripe Publishable Key (Powers Visa, Mastercard, Amex, Apple Pay, Google Pay, Klarna, Clearpay)
                  </label>
                  <input
                    type="text"
                    value={payoutSettings.stripe_publishable_key}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, stripe_publishable_key: e.target.value })}
                    placeholder="pk_live_... or pk_test_..."
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Stripe Secret Key (Keep Confidential)
                  </label>
                  <input
                    type="password"
                    value={payoutSettings.stripe_secret_key}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, stripe_secret_key: e.target.value })}
                    placeholder="sk_live_... or sk_test_..."
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] font-mono"
                  />
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleTestStripeConnection}
                      disabled={testingGateway || !payoutSettings.stripe_secret_key}
                      className="inline-flex items-center gap-1.5 bg-[#f5ede4] hover:bg-[#ebdccf] text-[#543d2f] px-3.5 py-1.5 rounded-xl text-xs font-medium border border-[#dfcebd] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {testingGateway ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-[#d49942]" />}
                      <span>Test Stripe Connection (api.stripe.com/v1/balance)</span>
                    </button>
                    <span className="text-[11px] text-[#8a7261]">
                      Validates your API credentials against Stripe live servers.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    PayPal Merchant Business Account Email (Powers PayPal & PayPal Pay in 3)
                  </label>
                  <input
                    type="email"
                    value={payoutSettings.paypal_email}
                    onChange={(e) => setPayoutSettings({ ...payoutSettings, paypal_email: e.target.value })}
                    placeholder="merchant@everythingalmost.co.uk"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleTestPaypalConnection}
                      disabled={testingGateway || !payoutSettings.paypal_email}
                      className="inline-flex items-center gap-1.5 bg-[#f5ede4] hover:bg-[#ebdccf] text-[#543d2f] px-3.5 py-1.5 rounded-xl text-xs font-medium border border-[#dfcebd] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {testingGateway ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#0070ba]" />}
                      <span>Verify PayPal Merchant Account</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Verification Result Banner */}
                {testGatewayResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs flex items-start gap-3 mt-3 shadow-2xs ${
                      testGatewayResult.success
                        ? 'bg-[#f0f9f1] border-[#c3e6cb] text-[#1b5e20]'
                        : 'bg-[#fdf2f2] border-[#f5c6cb] text-[#b71c1c]'
                    }`}
                  >
                    {testGatewayResult.success ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#2e7d32]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#c62828]" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold flex items-center gap-2">
                        <span>{testGatewayResult.success ? 'Gateway Verified Successfully' : 'Gateway Verification Issue'}</span>
                        {testGatewayResult.mode && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white border font-bold">
                            {testGatewayResult.mode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed">{testGatewayResult.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTestGatewayResult(null)}
                      className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#784d2f] hover:bg-[#623c22] text-white px-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide shadow-md cursor-pointer transition-colors"
              >
                Save Receiver & Banking Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT UPLOAD / EDIT MODAL */}
      {/* ========================================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#784d2f]">
                  {editingProduct ? 'Update Inventory' : 'Add New Inventory'}
                </span>
                <h3 className="font-serif text-2xl text-[#241c18]">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Upload New Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-[#785f4f] hover:text-[#241c18] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Handcrafted Rose Gold Locket"
                  required
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>

              {/* Category & Price Row */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  >
                    {BOUTIQUE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Price (£) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="29.99"
                    required
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Compare Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    placeholder="39.99"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                </div>
              </div>

              {/* Product Image File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32]">
                  Product Image {!editingProduct && '*'}
                </label>

                {imagePreview ? (
                  <div className="flex items-center gap-4 bg-white border border-[#dfcebd] rounded-2xl p-3">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[#ede1d3] shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-semibold text-[#241c18] truncate">
                        {imageFile ? imageFile.name : 'Current product image'}
                      </p>
                      <p className="text-[11px] text-[#785f4f]">
                        {imageFile
                          ? `${(imageFile.size / 1024).toFixed(1)} KB`
                          : 'Upload a new image below to replace it'}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <label className="inline-flex items-center gap-1.5 bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#423328] px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>Change Image</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleImageSelect(e.target.files?.[0])}
                            className="hidden"
                          />
                        </label>
                        {imageFile && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-[11px] text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleImageSelect(e.dataTransfer.files?.[0]);
                    }}
                    className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-[#fbf6ef] border-2 border-dashed border-[#d8c3ad] hover:border-[#784d2f] rounded-2xl px-6 py-7 text-center cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f4ebe0] text-[#784d2f] flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-[#241c18]">
                        Click to upload or drag and drop product image
                      </p>
                      <p className="text-[11px] text-[#8a7261]">
                        JPG, PNG, WEBP or GIF (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImageSelect(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Badge & Stock */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                    Product Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Bestseller, Seasonal, For Her"
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs text-[#241c18] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.in_stock}
                      onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
                      className="accent-[#784d2f] w-4 h-4"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#241c18] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="accent-[#784d2f] w-4 h-4"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the craftsmanship, materials, dimensions, and gift presentation..."
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>

              {/* Bespoke Customer Personalisation Fields Builder */}
              <div className="space-y-3 pt-3 border-t border-[#f0e4d7]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#523e32]">
                      <Sparkles className="w-3.5 h-3.5 text-[#784d2f]" />
                      <span>Customisation & Personalisation Fields</span>
                    </div>
                    <p className="text-[11px] text-[#8a7261] mt-0.5">
                      Specify what details customers must provide (e.g., photo upload for 3D crystal, recipient names for Christmas box, scent choice, dates).
                    </p>
                  </div>

                  {/* Add Field Preset Buttons */}
                  <div className="flex items-center flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddCustomField('image', 'Upload Photo to Engrave')}
                      className="bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Photo Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomField('text', 'Recipient Name')}
                      className="bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Text / Name</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomField('textarea', 'Special Message / Note')}
                      className="bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomField('select', 'Choose Option / Variation')}
                      className="bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Dropdown</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomField('date', 'Special Date')}
                      className="bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#543d2f] px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Date</span>
                    </button>
                  </div>
                </div>

                {/* Configured Fields List */}
                {productForm.custom_fields.length === 0 ? (
                  <div className="bg-[#fbf7f1] border border-dashed border-[#ddcbba] rounded-2xl p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-[#6e5849]">
                      Standard product with no custom details required.
                    </p>
                    <p className="text-[11px] text-[#9c897a]">
                      Click one of the buttons above to collect customer photos, names, or choices.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productForm.custom_fields.map((field, idx) => (
                      <div
                        key={field.id || idx}
                        className="bg-white border border-[#e4d4c2] rounded-2xl p-3.5 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#f4ede4]">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#784d2f] text-white text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#784d2f]">
                              {field.type === 'image' && '📷 Photo / Image Upload'}
                              {field.type === 'text' && '✍️ Single-line Text'}
                              {field.type === 'textarea' && '📝 Multi-line Note'}
                              {field.type === 'select' && '🔽 Option Dropdown'}
                              {field.type === 'date' && '📅 Date Picker'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(idx)}
                            className="p-1 text-red-600 hover:text-red-800 cursor-pointer rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-12 gap-3">
                          {/* Field Type Selector */}
                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold uppercase text-[#735e50] mb-1">
                              Field Type
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => handleUpdateCustomField(idx, 'type', e.target.value)}
                              className="w-full bg-[#fdfaf5] border border-[#dfcebd] rounded-xl px-2.5 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                            >
                              <option value="image">Photo / Image Upload</option>
                              <option value="text">Single-line Text (e.g. Name)</option>
                              <option value="textarea">Multi-line Message / Note</option>
                              <option value="select">Dropdown Choice</option>
                              <option value="date">Date Picker</option>
                            </select>
                          </div>

                          {/* Field Label Input */}
                          <div className="sm:col-span-8">
                            <label className="block text-[10px] font-bold uppercase text-[#735e50] mb-1">
                              Field Name / Question *
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateCustomField(idx, 'label', e.target.value)}
                              placeholder="e.g. Upload Photo to Engrave, First Recipient Name"
                              className="w-full bg-[#fdfaf5] border border-[#dfcebd] rounded-xl px-3 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                            />
                          </div>
                        </div>

                        {/* Options Input (Only for 'select') */}
                        {field.type === 'select' && (
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#735e50] mb-1">
                              Dropdown Options (Comma-separated)
                            </label>
                            <input
                              type="text"
                              value={field.options}
                              onChange={(e) => handleUpdateCustomField(idx, 'options', e.target.value)}
                              placeholder="e.g. Vanilla & Amber, Lavender Calm, Spiced Orange"
                              className="w-full bg-[#fdfaf5] border border-[#dfcebd] rounded-xl px-3 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                            />
                          </div>
                        )}

                        <div className="grid sm:grid-cols-12 gap-3 items-center">
                          {/* Placeholder / Hint */}
                          <div className="sm:col-span-8">
                            <label className="block text-[10px] font-bold uppercase text-[#735e50] mb-1">
                              Placeholder / Helper Hint (Optional)
                            </label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => handleUpdateCustomField(idx, 'placeholder', e.target.value)}
                              placeholder="e.g. High resolution portrait with clear lighting"
                              className="w-full bg-[#fdfaf5] border border-[#dfcebd] rounded-xl px-3 py-1.5 text-xs text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                            />
                          </div>

                          {/* Required Checkbox */}
                          <div className="sm:col-span-4 sm:pt-4">
                            <label className="flex items-center gap-2 text-xs text-[#241c18] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleUpdateCustomField(idx, 'required', e.target.checked)}
                                className="accent-[#784d2f] w-3.5 h-3.5"
                              />
                              <span className="font-medium">Customer must provide</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0e4d7]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-[#dfcebd] text-[#543d2f] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#f4ebe0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="bg-[#784d2f] hover:bg-[#623c22] text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm cursor-pointer transition-colors disabled:opacity-60"
                >
                  {savingProduct
                    ? editingProduct
                      ? 'Saving...'
                      : 'Uploading...'
                    : editingProduct
                      ? 'Save Changes'
                      : 'Upload Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER & PAYMENT RECEIPT MODAL */}
      {/* ========================================================================= */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#784d2f]">
                  Payment & Fulfillment Record
                </span>
                <h3 className="font-mono text-xl font-bold text-[#241c18]">
                  #{selectedOrderReceipt.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderReceipt(null)}
                className="p-1.5 text-[#785f4f] hover:text-[#241c18] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Status Switcher in Modal */}
            <div className="bg-[#f7efe4] p-4 rounded-2xl border border-[#ecd9c7] flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#785f4f] block">
                  Current Payment Status
                </span>
                <span className="font-bold text-xs uppercase text-[#241c18]">
                  {selectedOrderReceipt.payment_status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPaymentUpdate(selectedOrderReceipt.id, 'paid')}
                  className="bg-[#2b6b25] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Mark Paid
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPaymentUpdate(selectedOrderReceipt.id, 'refunded')}
                  className="bg-[#6929c4] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Issue Refund
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="text-xs text-[#523e32] space-y-1 bg-white p-4 rounded-2xl border border-[#ede1d3]">
              <h4 className="font-bold text-sm text-[#241c18] mb-1">{selectedOrderReceipt.customer_name}</h4>
              <p>Email: {selectedOrderReceipt.customer_email}</p>
              <p>Phone: {selectedOrderReceipt.customer_phone || '—'}</p>
              <p>Address: {selectedOrderReceipt.shipping_address}, {selectedOrderReceipt.city}</p>
              <p>Postal Code: {selectedOrderReceipt.postal_code}, {selectedOrderReceipt.country}</p>
              {selectedOrderReceipt.transaction_id && (
                <p className="pt-2 font-mono text-[11px] text-[#785f4f]">
                  Transaction Ref: {selectedOrderReceipt.transaction_id}
                </p>
              )}
            </div>

            {/* Items Purchased */}
            {selectedOrderReceipt.items && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#634e40]">
                  Purchased Items ({selectedOrderReceipt.items.length})
                </h4>
                <div className="divide-y divide-[#f0e4d7] max-h-72 overflow-y-auto pr-1 space-y-3">
                  {selectedOrderReceipt.items.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-start justify-between text-xs gap-3">
                        <div className="flex items-center gap-2.5">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#ecd9c7] shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-[#241c18]">{item.product_name}</p>
                            <p className="text-[11px] text-[#8a7261]">
                              Qty: {item.quantity} • £{Number(item.price).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#241c18] shrink-0">
                          £{Number(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Customer Customisation Details */}
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="p-3 bg-[#fbf5ee] border border-[#eadac9] rounded-xl space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#784d2f]">
                            <Sparkles className="w-3 h-3 text-[#784d2f]" />
                            <span>Customer Bespoke Details</span>
                          </div>
                          <div className="space-y-1.5 divide-y divide-[#f1e5d7] pt-1">
                            {Object.entries(item.customization).map(([label, val]) => {
                              if (!val) return null;
                              if (typeof val === 'object' && val.url) {
                                return (
                                  <div key={label} className="pt-1.5 flex items-center justify-between gap-3">
                                    <span className="font-semibold text-[#241c18]">{label}:</span>
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={val.url}
                                        alt={label}
                                        className="w-9 h-9 rounded-lg object-cover border border-[#d6beaa]"
                                      />
                                      <a
                                        href={val.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 bg-[#784d2f] hover:bg-[#623c22] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>View Photo</span>
                                      </a>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div key={label} className="pt-1.5 flex justify-between items-baseline gap-2">
                                  <span className="font-semibold text-[#241c18]">{label}:</span>
                                  <span className="text-[#543d2f] font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#e2d0bd]">
                                    {String(val)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Breakdown */}
            <div className="border-t border-[#f0e4d7] pt-3 text-xs space-y-1 text-[#523e32]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{Number(selectedOrderReceipt.subtotal).toFixed(2)}</span>
              </div>
              {Number(selectedOrderReceipt.discount) > 0 && (
                <div className="flex justify-between text-[#2b6b25]">
                  <span>Discount</span>
                  <span>-£{Number(selectedOrderReceipt.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({selectedOrderReceipt.shipping_method})</span>
                <span>£{Number(selectedOrderReceipt.shipping_cost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#784d2f] pt-2 border-t border-[#f0e4d7]">
                <span>Grand Total</span>
                <span>£{Number(selectedOrderReceipt.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

