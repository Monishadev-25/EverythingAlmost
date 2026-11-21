import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingCost,
    total,
    isFreeShipping,
    freeShippingRemainder,
    freeShippingThreshold,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg(res);
  };

  const freeShippingPercent = Math.min(
    100,
    Math.round(((subtotal - discount) / freeShippingThreshold) * 100)
  );

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#f3e6d7] text-[#784d2f] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-[#735e50] max-w-md mx-auto">
            You haven’t added any thoughtful gifts or candles yet. Explore our curated collections to find the perfect keepsake.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#784d2f] hover:bg-[#623c22] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-colors shadow-md"
          >
            <span>Explore the Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Title */}
      <div className="border-b border-[#ebdccd] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#241c18] font-normal">
          Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-[#735e50] mt-1">
          Review your selected items and apply gift codes before checkout.
        </p>
      </div>

      {/* Free Delivery Meter */}
      <div className="bg-[#fbf5ed] border border-[#ecd9c7] rounded-2xl p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#523e32]">
          <span className="flex items-center gap-2 font-medium">
            <Truck className="w-4 h-4 text-[#784d2f]" />
            {isFreeShipping ? (
              <span className="text-[#2b6b25] font-semibold">
                🎉 Congratulations! You unlocked FREE UK Delivery.
              </span>
            ) : (
              <span>
                Add <strong>£{freeShippingRemainder.toFixed(2)}</strong> more for <strong>FREE UK Delivery</strong> (Over £50).
              </span>
            )}
          </span>
          <span className="font-bold text-[#784d2f]">{freeShippingPercent}%</span>
        </div>
        <div className="w-full bg-[#ebd9c7] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#784d2f] h-full transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      {/* Main Cart Grid: Items Table + Summary */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="divide-y divide-[#f0e4d7]">
            {items.map((item) => (
              <div
                key={item.key || item.product.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-[#f4ecdf] shrink-0 border border-[#ecd9c7] mt-0.5"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#917562] font-semibold">
                      {item.product.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg text-[#241c18] font-normal leading-snug">
                      {item.product.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#784d2f]">
                      £{Number(item.product.price).toFixed(2)}
                    </p>

                    {/* Bespoke Customisation Summary */}
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="mt-2.5 p-2.5 bg-[#fbf6ef] border border-[#e8dacb] rounded-xl space-y-1.5 text-xs max-w-md">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#784d2f]">
                          <Sparkles className="w-3 h-3" />
                          <span>Customised Details</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-[#4a3a30]">
                          {Object.entries(item.customization).map(([label, val]) => {
                            if (!val) return null;
                            if (typeof val === 'object' && val.url) {
                              return (
                                <div key={label} className="flex items-center gap-2 pt-0.5">
                                  <span className="font-semibold text-[#241c18]">{label}:</span>
                                  <a
                                    href={val.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#784d2f] underline hover:text-[#52331d]"
                                  >
                                    <img
                                      src={val.url}
                                      alt={val.filename || label}
                                      className="w-7 h-7 rounded-md object-cover border border-[#d6beaa]"
                                    />
                                    <span>View Photo ↗</span>
                                  </a>
                                </div>
                              );
                            }
                            return (
                              <div key={label} className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="font-semibold text-[#241c18]">{label}:</span>
                                <span className="text-[#5f493b] font-medium">{String(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#dfcebd] rounded-xl bg-white px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key || item.product.id, item.quantity - 1)}
                      className="p-1 text-[#665042] hover:text-[#241c18] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#241c18]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key || item.product.id, item.quantity + 1)}
                      className="p-1 text-[#665042] hover:text-[#241c18] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-20 text-right">
                    <span className="font-serif text-base font-bold text-[#241c18]">
                      £{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.key || item.product.id)}
                    aria-label="Remove item"
                    className="p-1.5 text-[#917562] hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#f0e4d7] flex items-center justify-between text-xs text-[#735e50]">
            <Link
              to="/shop"
              className="text-[#784d2f] font-semibold hover:underline flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
            <span>Prices inclusive of UK VAT</span>
          </div>
        </div>

        {/* Right Column: Order Summary & Promo Code */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
            <h2 className="font-serif text-xl font-normal text-[#241c18] border-b border-[#f0e4d7] pb-3">
              Order Summary
            </h2>

            {/* Promo Code Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#543d2f] uppercase tracking-wider">
                Discount Code
              </label>

              {promoCode ? (
                <div className="flex items-center justify-between bg-[#f4ecdf] border border-[#d6beaa] rounded-xl px-3 py-2 text-xs">
                  <span className="flex items-center gap-1.5 text-[#2b6b25] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {promoCode} (10% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-xs text-[#784d2f] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Try code: WELCOME"
                    className="flex-1 bg-white border border-[#dfcebd] rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case placeholder:text-[#a89587] focus:outline-none focus:border-[#784d2f]"
                  />
                  <button
                    type="submit"
                    className="bg-[#784d2f] hover:bg-[#623c22] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMsg && (
                <p
                  className={`text-[11px] ${
                    promoMsg.success ? 'text-[#2b6b25]' : 'text-red-600'
                  }`}
                >
                  {promoMsg.message}
                </p>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 text-xs text-[#523e32] border-t border-[#f0e4d7] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#241c18]">£{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#2b6b25]">
                  <span>Discount (10%)</span>
                  <span>-£{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>UK Standard Shipping</span>
                <span className="font-semibold">
                  {isFreeShipping ? (
                    <span className="text-[#2b6b25]">FREE</span>
                  ) : (
                    `£${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-[#f0e4d7] pt-3 flex justify-between items-baseline text-[#241c18]">
                <span className="text-sm font-serif font-bold">Estimated Total</span>
                <span className="text-xl font-serif font-bold text-[#784d2f]">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#784d2f] hover:bg-[#623c22] text-white py-3.5 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

