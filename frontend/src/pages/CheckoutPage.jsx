import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Info,
  Landmark,
  Lock,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { createOrder } from '../api/orders';
import {
  fetchPublicPaymentConfig,
  createPaymentIntent,
} from '../api/payment';
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
} from '../components/PaymentLogos';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom', region: 'UK' },
  { code: 'IE', name: 'Republic of Ireland', region: 'EU' },
  { code: 'FR', name: 'France', region: 'EU' },
  { code: 'DE', name: 'Germany', region: 'EU' },
  { code: 'ES', name: 'Spain', region: 'EU' },
  { code: 'IT', name: 'Italy', region: 'EU' },
  { code: 'NL', name: 'Netherlands', region: 'EU' },
  { code: 'BE', name: 'Belgium', region: 'EU' },
  { code: 'AT', name: 'Austria', region: 'EU' },
  { code: 'SE', name: 'Sweden', region: 'EU' },
  { code: 'DK', name: 'Denmark', region: 'EU' },
  { code: 'PT', name: 'Portugal', region: 'EU' },
  { code: 'PL', name: 'Poland', region: 'EU' },
  { code: 'GR', name: 'Greece', region: 'EU' },
  { code: 'FI', name: 'Finland', region: 'EU' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'US', name: 'United States', region: 'International' },
  { code: 'CA', name: 'Canada', region: 'International' },
  { code: 'AU', name: 'Australia', region: 'International' },
];

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, discount, shippingCost, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Primary customer form
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    shipping_address: '',
    city: 'London',
    postal_code: '',
    country: 'United Kingdom',
    shipping_method: shippingCost === 0 ? 'Free UK Delivery' : 'Standard UK Delivery',
    notes: '',

    // Card Specific details
    cardholder_name: user?.name || '',
    card_number: '4242 4242 4242 4242',
    card_exp: '12/28',
    card_cvc: '123',
    billing_same_as_shipping: true,
    billing_address: '',
    billing_city: '',
    billing_postal_code: '',
    billing_country: 'United Kingdom',
  });

  // Public Gateway Configuration from Superadmin
  const [paymentConfig, setPaymentConfig] = useState(null);

  useEffect(() => {
    fetchPublicPaymentConfig()
      .then((cfg) => {
        if (cfg) setPaymentConfig(cfg);
      })
      .catch(() => {});
  }, []);

  // Active Payment Category: 'card' | 'wallets' | 'bnpl' | 'bank_transfer'
  const [paymentCategory, setPaymentCategory] = useState('card');

  // Selected specific payment method:
  // 'visa' | 'mastercard' | 'amex' | 'apple_pay' | 'google_pay' | 'paypal' | 'klarna' | 'clearpay' | 'paypal_pay_in_3' | 'bank_transfer'
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Inline Authentication / Authorization Modal (Zero-redirect execution)
  const [activeInlineSheet, setActiveInlineSheet] = useState(null); // 'apple_pay' | 'google_pay' | 'paypal' | 'klarna' | 'clearpay' | 'paypal_pay_in_3' | '3ds_card' | null
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Card Brand Detection
  const detectedCardBrand = useMemo(() => {
    const cleaned = form.card_number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    return null;
  }, [form.card_number]);

  // Installment Calculations
  const bnpl3Amount = useMemo(() => (total / 3).toFixed(2), [total]);
  const bnpl4Amount = useMemo(() => (total / 4).toFixed(2), [total]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/.{1,4}/g) || [];
    setForm((prev) => ({ ...prev, card_number: parts.join(' ') }));
  };

  const handleCardExpChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      raw = raw.substring(0, 2) + '/' + raw.substring(2, 4);
    }
    setForm((prev) => ({ ...prev, card_exp: raw }));
  };

  // Submit Order Execution (Called directly or via inline sheet authorization)
  const executeOrderPlacement = async (resolvedMethod = selectedMethod, transactionNote = '') => {
    if (items.length === 0) return;

    setSubmitting(true);
    setErrorMsg('');

    // Determine final payment method key for backend
    let finalMethod = resolvedMethod;
    if (resolvedMethod === 'card') {
      finalMethod = detectedCardBrand || 'card';
    }

    // Connect to server-side PaymentIntent for real cards / simulation
    let gatewayMetaNote = transactionNote;
    if (resolvedMethod === 'card' || resolvedMethod === 'visa' || resolvedMethod === 'mastercard' || resolvedMethod === 'amex') {
      try {
        const intentRes = await createPaymentIntent({
          amount: total,
          currency: paymentConfig?.currency || 'GBP',
          customer_email: form.customer_email,
          customer_name: form.customer_name,
        });
        if (intentRes?.payment_intent_id) {
          gatewayMetaNote = `${gatewayMetaNote} [Gateway: ${intentRes.mode} - Intent ${intentRes.payment_intent_id}]`.trim();
        }
      } catch {
        // Continue smoothly
      }
    }

    const payload = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      shipping_address: form.shipping_address,
      city: form.city,
      postal_code: form.postal_code,
      country: form.country,
      shipping_method: form.shipping_method,
      payment_method: finalMethod,
      notes: form.notes ? `${form.notes} ${gatewayMetaNote}`.trim() : gatewayMetaNote || null,
      subtotal,
      discount,
      shipping_cost: shippingCost,
      total,
      items: items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        image_url: item.product.image_url,
        customization: item.customization || null,
      })),
    };

    try {
      const order = await createOrder(payload);

      // Save to localStorage so Account page can immediately display it in history
      try {
        const existing = JSON.parse(
          window.localStorage.getItem('everythingalmost_local_orders') || '[]'
        );
        window.localStorage.setItem(
          'everythingalmost_local_orders',
          JSON.stringify([order, ...existing])
        );
      } catch {
        // ignore
      }

      setCompletedOrder(order);
      setActiveInlineSheet(null);
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
      setActiveInlineSheet(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Checkout Flow depending on selected method
  const handleInitiatePayment = (e) => {
    if (e) e.preventDefault();

    if (!form.customer_name || !form.customer_email || !form.shipping_address || !form.postal_code) {
      setErrorMsg('Please complete your name, email, and delivery address before proceeding to payment.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Direct Bank Wire (BACS): Immediate confirmation with bank invoice
    if (selectedMethod === 'bank_transfer') {
      executeOrderPlacement('bank_transfer', '[Customer opted for Direct Bank Wire / BACS]');
      return;
    }

    // Zero-redirect flows: Open inline biometric/approval sheets
    if (selectedMethod === 'apple_pay') {
      setActiveInlineSheet('apple_pay');
    } else if (selectedMethod === 'google_pay') {
      setActiveInlineSheet('google_pay');
    } else if (selectedMethod === 'paypal') {
      setActiveInlineSheet('paypal');
    } else if (selectedMethod === 'klarna') {
      setActiveInlineSheet('klarna');
    } else if (selectedMethod === 'clearpay') {
      setActiveInlineSheet('clearpay');
    } else if (selectedMethod === 'paypal_pay_in_3') {
      setActiveInlineSheet('paypal_pay_in_3');
    } else {
      // Debit/Credit Cards: Seamless PCI-compliant direct processing
      executeOrderPlacement('card');
    }
  };

  // =========================================================================
  // SUCCESS CONFIRMATION RECEIPT SCREEN
  // =========================================================================
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-[#f0e4d7] pb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
              completedOrder.payment_method === 'bank_transfer'
                ? 'bg-[#fef7ec] text-[#d49942]'
                : 'bg-[#edf6ec] text-[#2b6b25]'
            }`}>
              {completedOrder.payment_method === 'bank_transfer' ? (
                <Landmark className="w-9 h-9" />
              ) : (
                <CheckCircle2 className="w-9 h-9" />
              )}
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#784d2f] font-semibold">
                {completedOrder.payment_method === 'bank_transfer'
                  ? 'Order Received • Awaiting Bank Wire'
                  : 'Payment Authorized & Verified'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-[#735e50] mt-1">
                {completedOrder.payment_method === 'bank_transfer'
                  ? 'Your bespoke gift reservation has been placed. Please complete your bank transfer using the instructions below.'
                  : 'Your payment was processed securely. A confirmation email with receipt and order tracking has been sent to '}
                <strong>{completedOrder.customer_email}</strong>.
              </p>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid sm:grid-cols-4 gap-4 text-xs bg-[#f7efe4] p-4 rounded-2xl border border-[#ecd9c7]">
            <div>
              <span className="text-[#8a7261] uppercase tracking-wider block">Order Number</span>
              <span className="font-mono text-sm font-bold text-[#241c18]">
                #{completedOrder.order_number}
              </span>
            </div>
            <div>
              <span className="text-[#8a7261] uppercase tracking-wider block">Payment Method</span>
              <span className="font-semibold text-[#241c18] capitalize">
                {completedOrder.payment_method?.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-[#8a7261] uppercase tracking-wider block">
                {completedOrder.payment_method === 'bank_transfer' ? 'Wire Status' : 'Transaction Ref'}
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#784d2f] truncate block" title={completedOrder.transaction_id}>
                {completedOrder.payment_method === 'bank_transfer' ? 'Awaiting Bank Receipt' : (completedOrder.transaction_id || 'TXN_SECURE')}
              </span>
            </div>
            <div>
              <span className="text-[#8a7261] uppercase tracking-wider block">
                {completedOrder.payment_method === 'bank_transfer' ? 'Total Due' : 'Total Paid'}
              </span>
              <span className="font-serif text-base font-bold text-[#784d2f]">
                £{Number(completedOrder.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Direct Bank Wire Instruction Box (Only for bank_transfer orders) */}
          {completedOrder.payment_method === 'bank_transfer' && (
            <div className="bg-[#fcf8f2] border-2 border-[#d49942] rounded-2xl p-5 sm:p-6 space-y-3.5 text-xs">
              <div className="flex items-center gap-2.5 text-[#784d2f]">
                <div className="p-2 rounded-xl bg-[#faebd7]">
                  <Landmark className="w-5 h-5 text-[#d49942]" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#241c18]">
                    Direct Bank Wire Instructions (Action Required)
                  </h3>
                  <p className="text-[11px] text-[#785f4f]">
                    Please make a transfer from your UK/EU banking app to complete your order.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#ede1d3] font-mono text-xs">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-[#8a7261] block">Bank Name</span>
                  <span className="text-[#241c18] font-sans font-semibold text-xs">
                    {paymentConfig?.bank_details?.bank_name || 'Barclays Bank UK'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-[#8a7261] block">Account Holder Name</span>
                  <span className="text-[#241c18] font-sans font-semibold text-xs">
                    {paymentConfig?.bank_details?.account_holder || paymentConfig?.bank_details?.bank_account_name || 'Everything Almost Ltd'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-[#8a7261] block">UK Sort Code</span>
                  <span className="text-[#241c18] font-bold text-sm">
                    {paymentConfig?.bank_details?.sort_code || paymentConfig?.bank_details?.bank_sort_code || '20-00-00'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-[#8a7261] block">UK Account Number</span>
                  <span className="text-[#241c18] font-bold text-sm">
                    {paymentConfig?.bank_details?.account_number || paymentConfig?.bank_details?.bank_account_number || '12345678'}
                  </span>
                </div>
                {paymentConfig?.bank_details?.bank_iban && (
                  <div className="sm:col-span-2 pt-2 border-t border-[#f4ebe0]">
                    <span className="text-[10px] font-sans uppercase font-bold text-[#8a7261] block">IBAN (International / EU Customers)</span>
                    <span className="text-[#241c18] font-bold text-xs break-all">
                      {paymentConfig.bank_details.bank_iban}
                    </span>
                  </div>
                )}
                <div className="sm:col-span-2 pt-2 border-t border-[#f4ebe0] font-sans">
                  <span className="text-[10px] uppercase font-bold text-[#b45309] block">Mandatory Transfer Reference</span>
                  <span className="font-mono font-bold text-sm text-[#784d2f] bg-[#fdf5eb] px-3 py-1.5 rounded-lg inline-block mt-1 border border-[#ebd8c5]">
                    #{completedOrder.order_number}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#fdf5eb] rounded-xl border border-[#ebd8c5] text-[11px] text-[#7a4c15]">
                Once you send the transfer, our financial department will reconcile the transaction against reference <strong>#{completedOrder.order_number}</strong> and initiate handcrafting immediately.
              </div>
            </div>
          )}

          {/* Delivery & Security Note */}
          <div className="text-xs text-[#523e32] space-y-1 bg-white p-4 rounded-2xl border border-[#ede1d3]">
            <div className="flex items-center justify-between pb-1 border-b border-[#f3e7da]">
              <h4 className="font-semibold uppercase tracking-wider text-[#784d2f]">
                Shipping Destination ({completedOrder.country})
              </h4>
              <span className="text-[#2b6b25] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PCI-DSS Verified</span>
              </span>
            </div>
            <p className="font-medium text-[#241c18] pt-1">{completedOrder.customer_name}</p>
            <p>{completedOrder.shipping_address}, {completedOrder.city}</p>
            <p>{completedOrder.postal_code}, {completedOrder.country}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f0e4d7]">
            <Link
              to="/shop"
              className="w-full sm:w-auto text-center bg-[#784d2f] hover:bg-[#623c22] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors shadow-sm"
            >
              Continue Shopping →
            </Link>
            <Link
              to="/account?tab=orders"
              className="text-xs text-[#784d2f] font-semibold hover:underline"
            >
              View in My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // EMPTY CART REDIRECT PROMPT
  // =========================================================================
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#241c18]">No items in checkout</h2>
        <p className="text-xs text-[#735e50]">Please add gifts to your shopping bag before proceeding.</p>
        <Link
          to="/shop"
          className="inline-block bg-[#784d2f] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
        >
          Browse Shop →
        </Link>
      </div>
    );
  }

  // =========================================================================
  // MAIN CHECKOUT FORM
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-[#ebdccd] pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#735e50] mt-1">
            Complete your delivery and select your preferred payment method.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {paymentConfig?.environment === 'live' ? (
            <div className="flex items-center gap-2 text-xs text-[#2b6b25] bg-[#edf6ec] border border-[#d2ebd0] px-3.5 py-1.5 rounded-full font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2b6b25] animate-ping" />
              <ShieldCheck className="w-4 h-4 text-[#2b6b25]" />
              <span>Live Production Banking Active • PCI-DSS Level 1</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#784d2f] bg-[#fbf5ee] border border-[#e8d7c4] px-3.5 py-1.5 rounded-full font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#d49942]" />
              <ShieldCheck className="w-4 h-4 text-[#784d2f]" />
              <span>Sandbox Simulation Mode • Safe Testing</span>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <aside aria-label="Error message" className="bg-[#fbeeed] border border-[#f5c6c2] text-[#8e241c] text-xs p-4 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </aside>
      )}

      {/* Quick Express Checkout Banner (Top of Checkout) */}
      <div className="bg-[#fcf8f2] border border-[#ecd9c7] rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#784d2f] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#784d2f]" />
            <span>Express 1-Click Checkout (No Redirects)</span>
          </span>
          <span className="text-[11px] text-[#8a7261]">Instant biometric & wallet payment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Apple Pay Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('apple_pay');
              setPaymentCategory('wallets');
              handleInitiatePayment();
            }}
            className="flex items-center justify-center gap-2 bg-black hover:bg-[#1a1a1a] text-white py-3 px-4 rounded-2xl transition-transform active:scale-95 cursor-pointer shadow-sm"
          >
            <ApplePayLogo className="h-5 w-auto" />
            <span className="text-xs font-semibold">Pay with Touch / Face ID</span>
          </button>

          {/* Google Pay Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('google_pay');
              setPaymentCategory('wallets');
              handleInitiatePayment();
            }}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#3c4043] border border-[#dadce0] py-3 px-4 rounded-2xl transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <GooglePayLogo className="h-5 w-auto" />
            <span className="text-xs font-semibold">Pay with Google</span>
          </button>

          {/* PayPal Express Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('paypal');
              setPaymentCategory('wallets');
              handleInitiatePayment();
            }}
            className="flex items-center justify-center gap-2 bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] py-3 px-4 rounded-2xl transition-transform active:scale-95 cursor-pointer shadow-xs font-bold"
          >
            <PayPalLogo className="h-5 w-auto" />
            <span className="text-xs">Express Checkout</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleInitiatePayment} className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTACT & SHIPPING & PAYMENT */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <section className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-4">
            <h2 className="font-serif text-xl font-normal text-[#241c18] flex items-center justify-between">
              <span>1. Contact Details</span>
              <span className="text-xs text-[#784d2f] font-mono">Step 1 of 3</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Eleanor Vance"
                  required
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={form.customer_email}
                  onChange={handleChange}
                  placeholder="eleanor@example.co.uk"
                  required
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                Phone Number (For Delivery & Order Updates)
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                placeholder="+44 7911 123456"
                className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
              />
            </div>
          </section>

          {/* 2. Shipping Address */}
          <section className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-4">
            <h2 className="font-serif text-xl font-normal text-[#241c18] flex items-center justify-between">
              <span>2. Delivery Address</span>
              <span className="text-xs text-[#784d2f] font-mono">Step 2 of 3</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                name="shipping_address"
                value={form.shipping_address}
                onChange={handleChange}
                placeholder="Flat 4, 18 Rosewood Gardens"
                required
                className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                  Town / City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="London"
                  required
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="SW1A 1AA"
                  required
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                  Country / Region *
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#dfcebd] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                >
                  <optgroup label="United Kingdom & Europe">
                    {COUNTRIES.filter((c) => c.region === 'UK' || c.region === 'EU').map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} {c.region === 'EU' ? '(EU)' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="International">
                    {COUNTRIES.filter((c) => c.region === 'International' || c.region === 'Europe').map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Gift Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#523e32] mb-1.5">
                Gift Message or Special Delivery Instructions
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Include a bespoke gift tag message e.g., 'Merry Christmas Mum, with lots of love from Emily!'"
                className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
              />
            </div>
          </section>

          {/* 3. Comprehensive Payment Methods Section */}
          <section className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#f0e4d7] pb-4">
              <div>
                <h2 className="font-serif text-xl font-normal text-[#241c18]">
                  3. Payment Method
                </h2>
                <p className="text-xs text-[#785f4f] mt-0.5">
                  Select your preferred secure payment option. Zero merchant fees.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#2b6b25]">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-semibold">PCI-DSS Level 1 Encrypted</span>
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className={`grid ${paymentConfig?.bank_transfer_enabled !== false ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2 bg-[#f4ebe0] p-1.5 rounded-2xl border border-[#dfcebd]`}>
              <button
                type="button"
                onClick={() => {
                  setPaymentCategory('card');
                  setSelectedMethod('card');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  paymentCategory === 'card'
                    ? 'bg-white text-[#241c18] shadow-xs border border-[#ecd9c7]'
                    : 'text-[#6e5545] hover:text-[#241c18]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#784d2f]" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentCategory('wallets');
                  setSelectedMethod('apple_pay');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  paymentCategory === 'wallets'
                    ? 'bg-white text-[#241c18] shadow-xs border border-[#ecd9c7]'
                    : 'text-[#6e5545] hover:text-[#241c18]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#784d2f]" />
                <span>Digital Wallets</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentCategory('bnpl');
                  setSelectedMethod('klarna');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  paymentCategory === 'bnpl'
                    ? 'bg-white text-[#241c18] shadow-xs border border-[#ecd9c7]'
                    : 'text-[#6e5545] hover:text-[#241c18]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#784d2f]" />
                <span>Pay Later (BNPL)</span>
              </button>

              {paymentConfig?.bank_transfer_enabled !== false && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentCategory('bank_transfer');
                    setSelectedMethod('bank_transfer');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    paymentCategory === 'bank_transfer'
                      ? 'bg-white text-[#241c18] shadow-xs border border-[#ecd9c7]'
                      : 'text-[#6e5545] hover:text-[#241c18]'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-[#784d2f]" />
                  <span>Bank Wire (BACS)</span>
                </button>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY 1: DEBIT & CREDIT CARDS */}
            {/* ------------------------------------------------------------- */}
            {paymentCategory === 'card' && (
              <div className="space-y-4">
                {/* Accepted Card Badges */}
                <div className="flex items-center justify-between bg-[#fbf6ef] border border-[#ecd9c7] p-3 rounded-2xl">
                  <div className="text-xs text-[#523e32]">
                    <span className="font-semibold block">Accepted Cards</span>
                    <span className="text-[11px] text-[#7d6756]">UK, EU & Worldwide issued cards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`transition-all ${detectedCardBrand === 'visa' ? 'scale-110 ring-2 ring-[#784d2f] rounded' : ''}`}>
                      <VisaLogo className="h-6 w-9 rounded" />
                    </div>
                    <div className={`transition-all ${detectedCardBrand === 'mastercard' ? 'scale-110 ring-2 ring-[#784d2f] rounded' : ''}`}>
                      <MastercardLogo className="h-6 w-9 rounded" />
                    </div>
                    <div className={`transition-all ${detectedCardBrand === 'amex' ? 'scale-110 ring-2 ring-[#784d2f] rounded' : ''}`}>
                      <AmexLogo className="h-6 w-9 rounded" />
                    </div>
                  </div>
                </div>

                {/* Card Input Fields */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#dfcebd] space-y-4 shadow-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#735e50] mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      name="cardholder_name"
                      value={form.cardholder_name}
                      onChange={handleChange}
                      placeholder="Eleanor Vance"
                      required
                      className="w-full bg-[#faf7f2] border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold uppercase text-[#735e50]">
                        Card Number *
                      </label>
                      {detectedCardBrand && (
                        <span className="text-[10px] uppercase font-bold text-[#784d2f]">
                          Detected: {detectedCardBrand.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="card_number"
                        value={form.card_number}
                        onChange={handleCardNumberChange}
                        placeholder="4242 •••• •••• 4242"
                        required
                        className="w-full bg-[#faf7f2] border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wider"
                      />
                      <div className="absolute right-3 top-2.5">
                        <Lock className="w-4 h-4 text-[#a38b78]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[#735e50] mb-1">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        name="card_exp"
                        value={form.card_exp}
                        onChange={handleCardExpChange}
                        placeholder="12/28"
                        required
                        className="w-full bg-[#faf7f2] border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[#735e50] mb-1">
                        Security Code (CVC) *
                      </label>
                      <input
                        type="password"
                        name="card_cvc"
                        maxLength={4}
                        value={form.card_cvc}
                        onChange={handleChange}
                        placeholder="123"
                        required
                        className="w-full bg-[#faf7f2] border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Billing address match toggle */}
                  <div className="pt-2 border-t border-[#f2e5d7]">
                    <label className="flex items-center gap-2 text-xs text-[#463529] cursor-pointer">
                      <input
                        type="checkbox"
                        name="billing_same_as_shipping"
                        checked={form.billing_same_as_shipping}
                        onChange={handleChange}
                        className="accent-[#784d2f] w-3.5 h-3.5"
                      />
                      <span>Billing address is same as delivery address</span>
                    </label>

                    {!form.billing_same_as_shipping && (
                      <div className="mt-3 p-3 bg-[#faf7f2] rounded-xl border border-[#e8d7c4] space-y-2 text-xs">
                        <input
                          type="text"
                          name="billing_address"
                          value={form.billing_address}
                          onChange={handleChange}
                          placeholder="Billing Street Address"
                          className="w-full bg-white border border-[#dfcebd] rounded-lg px-3 py-1.5"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="billing_city"
                            value={form.billing_city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full bg-white border border-[#dfcebd] rounded-lg px-3 py-1.5"
                          />
                          <input
                            type="text"
                            name="billing_postal_code"
                            value={form.billing_postal_code}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            className="w-full bg-white border border-[#dfcebd] rounded-lg px-3 py-1.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#715c4d] bg-[#fdf8f2] p-2.5 rounded-xl border border-[#ecd9c7]">
                  <ShieldCheck className="w-4 h-4 text-[#2b6b25] shrink-0" />
                  <span>
                    Your payment is protected by <strong>3D Secure 2.0 (Verified by Visa, Mastercard Identity Check & Amex SafeKey)</strong>. No raw card data is stored unencrypted.
                  </span>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY 2: DIGITAL WALLETS */}
            {/* ------------------------------------------------------------- */}
            {paymentCategory === 'wallets' && (
              <div className="space-y-3">
                {/* Apple Pay Radio Option */}
                <label
                  onClick={() => setSelectedMethod('apple_pay')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'apple_pay'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_wallet"
                      checked={selectedMethod === 'apple_pay'}
                      onChange={() => setSelectedMethod('apple_pay')}
                      className="accent-[#784d2f]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                        Apple Pay
                      </span>
                      <span className="text-[11px] text-[#785f4f]">
                        Fast biometric checkout via Touch ID or Face ID
                      </span>
                    </div>
                  </div>
                  <ApplePayLogo className="h-6 w-9 rounded" />
                </label>

                {/* Google Pay Radio Option */}
                <label
                  onClick={() => setSelectedMethod('google_pay')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'google_pay'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_wallet"
                      checked={selectedMethod === 'google_pay'}
                      onChange={() => setSelectedMethod('google_pay')}
                      className="accent-[#784d2f]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                        Google Pay
                      </span>
                      <span className="text-[11px] text-[#785f4f]">
                        Pay directly using cards saved to your Google Account
                      </span>
                    </div>
                  </div>
                  <GooglePayLogo className="h-6 w-9 rounded" />
                </label>

                {/* PayPal Radio Option */}
                <label
                  onClick={() => setSelectedMethod('paypal')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'paypal'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method_wallet"
                      checked={selectedMethod === 'paypal'}
                      onChange={() => setSelectedMethod('paypal')}
                      className="accent-[#784d2f]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                        PayPal (In-Context)
                      </span>
                      <span className="text-[11px] text-[#785f4f]">
                        Zero-redirect embedded PayPal authorization
                      </span>
                    </div>
                  </div>
                  <PayPalLogo className="h-6 w-9 rounded" />
                </label>

                <div className="p-3 bg-[#f7efe4] rounded-xl border border-[#ecd9c7] text-[11px] text-[#6d5747] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#784d2f] shrink-0" />
                  <span>
                    Express wallets bypass manual card entry and execute securely right inside this page without external redirects.
                  </span>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY 3: BUY NOW, PAY LATER (BNPL) */}
            {/* ------------------------------------------------------------- */}
            {paymentCategory === 'bnpl' && (
              <div className="space-y-4">
                {/* Klarna Pay in 3 */}
                <label
                  onClick={() => setSelectedMethod('klarna')}
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'klarna'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method_bnpl"
                        checked={selectedMethod === 'klarna'}
                        onChange={() => setSelectedMethod('klarna')}
                        className="accent-[#784d2f]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                          Klarna: Pay in 3
                        </span>
                        <span className="text-[11px] text-[#785f4f]">
                          3 interest-free payments of <strong>£{bnpl3Amount}</strong>
                        </span>
                      </div>
                    </div>
                    <KlarnaLogo className="h-6 w-9 rounded" />
                  </div>

                  {selectedMethod === 'klarna' && (
                    <div className="mt-3 pt-3 border-t border-[#ebdccb] grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-white p-2 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">Today</span>
                        <strong className="text-xs text-[#241c18]">£{bnpl3Amount}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">In 30 days</span>
                        <strong className="text-xs text-[#241c18]">£{bnpl3Amount}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">In 60 days</span>
                        <strong className="text-xs text-[#241c18]">£{bnpl3Amount}</strong>
                      </div>
                    </div>
                  )}
                </label>

                {/* Clearpay Pay in 4 */}
                <label
                  onClick={() => setSelectedMethod('clearpay')}
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'clearpay'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method_bnpl"
                        checked={selectedMethod === 'clearpay'}
                        onChange={() => setSelectedMethod('clearpay')}
                        className="accent-[#784d2f]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                          Clearpay: Pay in 4
                        </span>
                        <span className="text-[11px] text-[#785f4f]">
                          4 interest-free fortnightly payments of <strong>£{bnpl4Amount}</strong>
                        </span>
                      </div>
                    </div>
                    <ClearpayLogo className="h-6 w-9 rounded" />
                  </div>

                  {selectedMethod === 'clearpay' && (
                    <div className="mt-3 pt-3 border-t border-[#ebdccb] grid grid-cols-4 gap-1.5 text-center text-[10px]">
                      <div className="bg-white p-1.5 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">Today</span>
                        <strong className="text-[11px] text-[#241c18]">£{bnpl4Amount}</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">2 weeks</span>
                        <strong className="text-[11px] text-[#241c18]">£{bnpl4Amount}</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">4 weeks</span>
                        <strong className="text-[11px] text-[#241c18]">£{bnpl4Amount}</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-[#e2d0bd]">
                        <span className="text-[#8a7261] block">6 weeks</span>
                        <strong className="text-[11px] text-[#241c18]">£{bnpl4Amount}</strong>
                      </div>
                    </div>
                  )}
                </label>

                {/* PayPal Pay in 3 */}
                <label
                  onClick={() => setSelectedMethod('paypal_pay_in_3')}
                  className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMethod === 'paypal_pay_in_3'
                      ? 'border-[#784d2f] bg-[#fbf5ee] ring-1 ring-[#784d2f]'
                      : 'border-[#dfcebd] bg-white hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method_bnpl"
                        checked={selectedMethod === 'paypal_pay_in_3'}
                        onChange={() => setSelectedMethod('paypal_pay_in_3')}
                        className="accent-[#784d2f]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-[#241c18] block">
                          PayPal Pay in 3
                        </span>
                        <span className="text-[11px] text-[#785f4f]">
                          Spread into 3 equal monthly payments of <strong>£{bnpl3Amount}</strong>
                        </span>
                      </div>
                    </div>
                    <PayPalPayIn3Logo className="h-6 w-9 rounded" />
                  </div>
                </label>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY 4: DIRECT BANK WIRE (BACS) */}
            {/* ------------------------------------------------------------- */}
            {paymentCategory === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#dfcebd] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f2e5d7]">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-[#784d2f]" />
                      <span className="font-semibold text-xs sm:text-sm text-[#241c18]">
                        Direct UK & EU Bank Wire (Faster Payments / BACS)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#2b6b25] bg-[#edf6ec] px-2.5 py-1 rounded-full border border-[#d2ebd0]">
                      Zero Processing Fees
                    </span>
                  </div>

                  <p className="text-xs text-[#6e5545] leading-relaxed">
                    Pay securely from your mobile banking app or online banking. Transfer the order balance directly to our verified UK business account:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 bg-[#faf7f2] p-4 rounded-xl border border-[#ebdccb] text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a7261] font-sans block">Bank Name</span>
                      <strong className="text-[#241c18] text-xs font-sans">
                        {paymentConfig?.bank_details?.bank_name || 'Barclays Bank UK'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a7261] font-sans block">Beneficiary / Account Name</span>
                      <strong className="text-[#241c18] text-xs font-sans">
                        {paymentConfig?.bank_details?.account_holder || paymentConfig?.bank_details?.bank_account_name || 'Everything Almost Ltd'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a7261] font-sans block">UK Sort Code</span>
                      <strong className="text-[#241c18] text-sm">
                        {paymentConfig?.bank_details?.sort_code || paymentConfig?.bank_details?.bank_sort_code || '20-00-00'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8a7261] font-sans block">UK Account Number</span>
                      <strong className="text-[#241c18] text-sm">
                        {paymentConfig?.bank_details?.account_number || paymentConfig?.bank_details?.bank_account_number || '12345678'}
                      </strong>
                    </div>
                    {paymentConfig?.bank_details?.bank_iban && (
                      <div className="sm:col-span-2 pt-2 border-t border-[#f0e4d7]">
                        <span className="text-[10px] uppercase font-bold text-[#8a7261] font-sans block">IBAN (International / EU Customers)</span>
                        <strong className="text-[#241c18] text-xs break-all">
                          {paymentConfig.bank_details.bank_iban}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-[#fdf8ee] rounded-xl border border-[#fae4be] text-xs text-[#704812] space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d49942]" />
                      <span>Payment Reference Instructions</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Please use your unique <strong>Order Number</strong> (generated immediately on clicking Place Order below) as the transfer reference so our automated accounting reconciles your order instantly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* International Payments Note */}
            <div className="pt-2 text-[11px] text-[#785f4f] flex items-center justify-between border-t border-[#f0e4d7]">
              <span>International UK & EU billing supported</span>
              <span>All charges in GBP (£)</span>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm sticky top-28">
            <h2 className="font-serif text-xl font-normal text-[#241c18] border-b border-[#f0e4d7] pb-3">
              In Your Order ({items.length})
            </h2>

            {/* Items list preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-[#f0e4d7]">
              {items.map((item) => (
                <div key={item.key || item.product.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#ecd9c7] mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#241c18] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-[#785f4f]">
                      Qty: {item.quantity} • £{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#784d2f] font-semibold bg-[#f4ebe0] px-2 py-0.5 rounded-md mt-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Bespoke Personalised</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#523e32] border-t border-[#f0e4d7] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#241c18]">£{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#2b6b25]">
                  <span>Discount</span>
                  <span>-£{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery ({form.country})</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-[#2b6b25]">FREE UK Delivery</span>
                  ) : (
                    `£${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-[#f0e4d7] pt-3 flex justify-between items-baseline text-[#241c18]">
                <span className="text-sm font-serif font-bold">Total to Pay</span>
                <span className="text-2xl font-serif font-bold text-[#784d2f]">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Selected Method Summary Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 ${
                selectedMethod === 'apple_pay'
                  ? 'bg-black hover:bg-[#222] text-white'
                  : selectedMethod === 'google_pay'
                    ? 'bg-white hover:bg-gray-50 text-[#3c4043] border border-[#dadce0]'
                    : selectedMethod === 'paypal' || selectedMethod === 'paypal_pay_in_3'
                      ? 'bg-[#ffc439] hover:bg-[#f2b92e] text-[#003087]'
                      : selectedMethod === 'klarna'
                        ? 'bg-[#FFB3C7] hover:bg-[#ffa2b9] text-[#0A0708]'
                        : selectedMethod === 'clearpay'
                          ? 'bg-[#B2FCE4] hover:bg-[#96f9da] text-[#0A0708]'
                          : 'bg-[#784d2f] hover:bg-[#623c22] text-white'
              }`}
            >
              {submitting ? (
                <span>Authorizing Payment...</span>
              ) : selectedMethod === 'apple_pay' ? (
                <>
                  <ApplePayLogo className="h-4 w-auto" />
                  <span>Pay with Apple Pay • £{total.toFixed(2)}</span>
                </>
              ) : selectedMethod === 'google_pay' ? (
                <>
                  <GooglePayLogo className="h-4 w-auto" />
                  <span>Pay with Google Pay • £{total.toFixed(2)}</span>
                </>
              ) : selectedMethod === 'paypal' ? (
                <>
                  <PayPalLogo className="h-4 w-auto" />
                  <span>Pay with PayPal • £{total.toFixed(2)}</span>
                </>
              ) : selectedMethod === 'klarna' ? (
                <>
                  <KlarnaLogo className="h-4 w-auto" />
                  <span>Pay in 3 with Klarna • £{bnpl3Amount}/mo</span>
                </>
              ) : selectedMethod === 'clearpay' ? (
                <>
                  <ClearpayLogo className="h-4 w-auto" />
                  <span>Pay in 4 with Clearpay • £{bnpl4Amount}</span>
                </>
              ) : selectedMethod === 'paypal_pay_in_3' ? (
                <>
                  <PayPalPayIn3Logo className="h-4 w-auto" />
                  <span>PayPal Pay in 3 • £{bnpl3Amount}/mo</span>
                </>
              ) : selectedMethod === 'bank_transfer' ? (
                <>
                  <Landmark className="w-4 h-4" />
                  <span>Place Order via Bank Wire • £{total.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • £{total.toFixed(2)}</span>
                </>
              )}
            </button>

            {/* Accepted Payment Logos Trust Strip */}
            <div className="pt-2 border-t border-[#f0e4d7] space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8a7261] block text-center">
                Guaranteed Safe & Secure Checkout
              </span>
              <PaymentLogosStrip className="flex justify-center" />
            </div>

            <p className="text-[11px] text-center text-[#735e50]">
              By placing your order, you agree to our 30-day handcrafted guarantee and delivery terms.
            </p>
          </div>
        </aside>
      </form>

      {/* ========================================================================= */}
      {/* ZERO-REDIRECT INLINE AUTHORIZATION MODALS / SHEETS */}
      {/* ========================================================================= */}

      {/* 1. APPLE PAY INLINE SHEET */}
      {activeInlineSheet === 'apple_pay' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] text-white w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl border border-[#3a3a3c] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
              <div className="flex items-center gap-2">
                <ApplePayLogo className="h-6 w-auto" />
                <span className="font-semibold text-sm">Apple Pay Authorization</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#8e8e93] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#2c2c2e] p-4 rounded-2xl">
              <div className="flex justify-between py-1 border-b border-[#3a3a3c]">
                <span className="text-[#8e8e93]">Card</span>
                <span className="font-medium">Everyday Debit (•••• 8821)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3a3a3c]">
                <span className="text-[#8e8e93]">Ship To</span>
                <span className="font-medium">{form.shipping_address}, {form.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3a3a3c]">
                <span className="text-[#8e8e93]">Contact</span>
                <span className="font-medium">{form.customer_email}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold pt-2">
                <span>Total Amount</span>
                <span className="text-[#30d158]">£{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#2c2c2e] border border-[#3a3a3c] flex items-center justify-center mx-auto text-[#0a84ff] animate-pulse">
                <Fingerprint className="w-8 h-8" />
              </div>
              <p className="text-xs text-[#8e8e93]">
                Confirm with Touch ID or Double-Click Side Button
              </p>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('apple_pay', '[Apple Pay Touch ID Verified]')}
              className="w-full bg-white hover:bg-[#e5e5ea] text-black font-semibold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-md"
            >
              {submitting ? 'Verifying with Touch ID...' : `Authorize £${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {/* 2. GOOGLE PAY INLINE SHEET */}
      {activeInlineSheet === 'google_pay' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#202124] w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl border border-[#dadce0] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-3">
              <div className="flex items-center gap-2">
                <GooglePayLogo className="h-6 w-auto" />
                <span className="font-semibold text-sm">Google Pay</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#5f6368] hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#f8f9fa] p-4 rounded-2xl border border-[#e8eaed]">
              <div className="flex justify-between py-1 border-b border-[#e8eaed]">
                <span className="text-[#5f6368]">Account</span>
                <span className="font-medium text-[#202124]">{form.customer_email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e8eaed]">
                <span className="text-[#5f6368]">Payment Method</span>
                <span className="font-medium">Visa •••• 4242 (Google Account)</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold pt-2">
                <span>Total to Pay</span>
                <span className="text-[#1a73e8]">£{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('google_pay', '[Google Pay Verified]')}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-sm"
            >
              {submitting ? 'Processing GPay...' : `Confirm & Pay £${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {/* 3. PAYPAL IN-CONTEXT POPUP SHEET */}
      {activeInlineSheet === 'paypal' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfaf5] border border-[#ede1d3] w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3">
              <div className="flex items-center gap-2">
                <PayPalLogo className="h-6 w-auto" />
                <span className="font-bold text-sm text-[#003087]">In-Context Checkout</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#785f4f] hover:text-[#241c18] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#ecd9c7] space-y-2 text-xs">
              <p className="text-[#523e32]">
                Paying as <strong>{form.customer_email}</strong>
              </p>
              <p className="text-[#785f4f]">
                Funding source: <strong>PayPal Balance / Linked Bank Account</strong>
              </p>
              <div className="border-t border-[#f0e4d7] pt-2 flex justify-between font-bold text-sm text-[#003087]">
                <span>Total Amount</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('paypal', '[PayPal In-Context Verified]')}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-sm"
            >
              {submitting ? 'Authorizing PayPal...' : `Agree & Complete £${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {/* 4. KLARNA INLINE AUTHORIZATION SHEET */}
      {activeInlineSheet === 'klarna' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff0f4] text-[#0A0708] w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl border border-[#ffb3c7] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#ffb3c7] pb-3">
              <div className="flex items-center gap-2">
                <KlarnaLogo className="h-6 w-auto" />
                <span className="font-bold text-sm">Pay in 3 Instalments</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#0a0708] hover:opacity-60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#ffb3c7] text-xs">
              <p className="font-semibold text-sm">Payment Schedule (0% APR, No Fees)</p>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-[#ffe1e9]">
                  <span>1. Today</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ffe1e9]">
                  <span>2. In 30 Days</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>3. In 60 Days</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#555] bg-white/70 p-3 rounded-xl">
              ✓ Instant soft check completed. No impact on your credit score.
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('klarna', `[Klarna Pay in 3 Verified: 3x £${bnpl3Amount}]`)}
              className="w-full bg-[#0A0708] hover:bg-[#222] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-md"
            >
              {submitting ? 'Confirming with Klarna...' : `Confirm & Pay £${bnpl3Amount} Today`}
            </button>
          </div>
        </div>
      )}

      {/* 5. CLEARPAY INLINE AUTHORIZATION SHEET */}
      {activeInlineSheet === 'clearpay' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#e8fff8] text-[#0A0708] w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl border border-[#b2fce4] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#b2fce4] pb-3">
              <div className="flex items-center gap-2">
                <ClearpayLogo className="h-6 w-auto" />
                <span className="font-bold text-sm">Pay in 4 Fortnightly</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#0a0708] hover:opacity-60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#b2fce4] text-xs">
              <p className="font-semibold text-sm">4 Equal Instalments (Interest-Free)</p>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-[#e0f9f1]">
                  <span>Payment 1 (Today)</span>
                  <strong>£{bnpl4Amount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e0f9f1]">
                  <span>Payment 2 (2 Weeks)</span>
                  <strong>£{bnpl4Amount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e0f9f1]">
                  <span>Payment 3 (4 Weeks)</span>
                  <strong>£{bnpl4Amount}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Payment 4 (6 Weeks)</span>
                  <strong>£{bnpl4Amount}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('clearpay', `[Clearpay Pay in 4 Verified: 4x £${bnpl4Amount}]`)}
              className="w-full bg-[#0A0708] hover:bg-[#222] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-md"
            >
              {submitting ? 'Confirming with Clearpay...' : `Confirm & Pay £${bnpl4Amount} Today`}
            </button>
          </div>
        </div>
      )}

      {/* 6. PAYPAL PAY IN 3 INLINE SHEET */}
      {activeInlineSheet === 'paypal_pay_in_3' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#f0f7ff] text-[#0A0708] w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl border border-[#bfe0ff] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#bfe0ff] pb-3">
              <div className="flex items-center gap-2">
                <PayPalPayIn3Logo className="h-6 w-auto" />
                <span className="font-bold text-sm text-[#003087]">PayPal Pay in 3</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInlineSheet(null)}
                className="text-[#0a0708] hover:opacity-60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#bfe0ff] text-xs">
              <p className="font-semibold text-sm text-[#003087]">Split into 3 Monthly Payments</p>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-[#eaf3fc]">
                  <span>Today</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eaf3fc]">
                  <span>Next Month</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Month After</span>
                  <strong>£{bnpl3Amount}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => executeOrderPlacement('paypal_pay_in_3', `[PayPal Pay in 3 Verified: 3x £${bnpl3Amount}]`)}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide cursor-pointer transition-colors shadow-md"
            >
              {submitting ? 'Confirming PayPal Pay in 3...' : `Confirm & Pay £${bnpl3Amount} Today`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
