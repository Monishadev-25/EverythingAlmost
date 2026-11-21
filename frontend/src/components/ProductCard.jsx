import { useState } from 'react';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCustomisationModal } from './ProductCustomisationModal';

export function ProductCard({ product, onCustomise }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [customiseModalOpen, setCustomiseModalOpen] = useState(false);

  const wishlisted = isInWishlist(product.id);
  const hasCustomisation = Array.isArray(product.custom_fields) && product.custom_fields.length > 0;

  const handleAddToCart = () => {
    if (hasCustomisation) {
      if (onCustomise) {
        onCustomise(product);
      } else {
        setCustomiseModalOpen(true);
      }
      return;
    }

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCustomModalAdd = (prod, qty, customization) => {
    addToCart(prod, qty, customization);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="group relative bg-[#fdfaf5] rounded-2xl border border-[#ede3d7] p-3 sm:p-3.5 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-[#d9c4af]">
        {/* Product Image Area */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#f4ecdf] mb-3.5">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges / Pill */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {hasCustomisation && (
              <span className="bg-[#784d2f] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Customisable</span>
              </span>
            )}
            {product.badge && (
              <span className="bg-[#fdfaf5]/90 backdrop-blur-sm text-[#8a5734] border border-[#ebd8c5] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              wishlisted
                ? 'bg-[#8a5734] text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-[#544337] hover:bg-white hover:text-[#8a5734]'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${wishlisted ? 'fill-current' : 'stroke-[1.8]'}`}
            />
          </button>
        </div>

        {/* Product Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base sm:text-lg text-[#241c18] font-normal leading-snug line-clamp-2 mb-1.5 group-hover:text-[#8a5734] transition-colors">
              {product.name}
            </h3>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-1 text-xs text-[#715c4d] mb-2">
              <div className="flex items-center text-[#d49942]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-current text-[#d49942]'
                        : 'text-[#d4c3b2]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium ml-0.5">
                ({product.reviews_count || 12})
              </span>
            </div>
          </div>

          {/* Price & Add to Cart Button */}
          <div className="pt-2">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base sm:text-lg font-semibold text-[#241c18]">
                £{Number(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-[#9d8979] line-through">
                  £{Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-2 px-3.5 rounded-xl text-xs sm:text-[13px] font-medium tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                added
                  ? 'bg-[#3b2a21] text-white border-[#3b2a21]'
                  : hasCustomisation
                    ? 'bg-[#f7efe4] hover:bg-[#ede0d0] text-[#784d2f] border-[#e2d2c1] font-semibold'
                    : 'bg-[#f4ebe0] hover:bg-[#e8dbcc] text-[#3e2d23] border-[#e2d2c1]'
              }`}
            >
              {hasCustomisation ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#784d2f]" />
                  <span>{added ? 'Personalised Item Added ✓' : 'Customise & Add ✨'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{added ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Product Customisation Modal */}
      {hasCustomisation && (
        <ProductCustomisationModal
          product={product}
          isOpen={customiseModalOpen}
          onClose={() => setCustomiseModalOpen(false)}
          onAddToCart={handleCustomModalAdd}
        />
      )}
    </>
  );
}

