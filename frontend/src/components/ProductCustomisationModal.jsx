import { useState } from 'react';
import { Check, Heart, Sparkles, Upload, X } from 'lucide-react';
import { uploadCustomImage } from '../api/orders';

export function ProductCustomisationModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const customFields = Array.isArray(product.custom_fields) ? product.custom_fields : [];
  const [formValues, setFormValues] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTextChange = (fieldIdOrLabel, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldIdOrLabel]: value,
    }));
    setErrorMessage('');
  };

  const handleImageUpload = async (fieldKey, fieldLabel, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size must be 10MB or smaller.');
      return;
    }

    setUploadingField(fieldKey);
    setErrorMessage('');

    try {
      const res = await uploadCustomImage(file);
      setFormValues((prev) => ({
        ...prev,
        [fieldKey]: {
          type: 'image',
          label: fieldLabel,
          url: res.url,
          filename: res.filename || file.name,
        },
      }));
    } catch (err) {
      // Fallback to local data URL if backend upload fails
      const reader = new FileReader();
      reader.onload = () => {
        setFormValues((prev) => ({
          ...prev,
          [fieldKey]: {
            type: 'image',
            label: fieldLabel,
            url: reader.result,
            filename: file.name,
          },
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  const handleRemoveImage = (fieldKey) => {
    setFormValues((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    for (const field of customFields) {
      const key = field.id || field.label;
      const val = formValues[key];

      if (field.required) {
        if (!val) {
          setErrorMessage(`Please provide "${field.label}" to proceed.`);
          return;
        }
        if (field.type === 'image' && (!val.url || !val.url.trim())) {
          setErrorMessage(`Please upload a photo for "${field.label}".`);
          return;
        }
        if (typeof val === 'string' && !val.trim()) {
          setErrorMessage(`"${field.label}" cannot be empty.`);
          return;
        }
      }
    }

    // Format customization map for the order
    const formattedCustomization = {};
    for (const field of customFields) {
      const key = field.id || field.label;
      const val = formValues[key];
      if (val !== undefined && val !== null && val !== '') {
        if (field.type === 'image' && typeof val === 'object') {
          formattedCustomization[field.label] = {
            type: 'image',
            url: val.url,
            filename: val.filename,
          };
        } else {
          formattedCustomization[field.label] = val;
        }
      }
    }

    onAddToCart(product, quantity, formattedCustomization);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#f0e4d7] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#f4ebe0] border border-[#ebdccb] shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#784d2f]">
                <Sparkles className="w-3 h-3" />
                <span>Bespoke Personalisation</span>
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-[#241c18] font-medium leading-snug line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs font-semibold text-[#784d2f] mt-0.5">
                £{Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#785f4f] hover:text-[#241c18] cursor-pointer rounded-full hover:bg-[#f4ebe0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Note */}
        <div className="bg-[#fbf4eb] border border-[#f0ded0] rounded-2xl p-3.5 text-xs text-[#6e5849] flex items-start gap-2.5">
          <span className="text-base leading-none">✨</span>
          <p className="leading-relaxed">
            This gift is custom crafted in our studio. Enter your custom details below and our artisans will personalise it with precision.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-[#fbeeed] border border-[#f5c6c2] text-[#8e241c] text-xs p-3 rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Custom Fields Defined by Admin */}
          {customFields.map((field, idx) => {
            const key = field.id || field.label || `field_${idx}`;
            const currentValue = formValues[key];

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#423328] flex items-center gap-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-[#a43b2e]">*</span>}
                  </label>
                  {!field.required && (
                    <span className="text-[10px] text-[#8f7b6d] lowercase italic">optional</span>
                  )}
                </div>

                {/* 1. IMAGE UPLOAD FIELD */}
                {field.type === 'image' && (
                  <div>
                    {currentValue && currentValue.url ? (
                      <div className="flex items-center gap-3 bg-white border border-[#dfcebd] rounded-2xl p-3">
                        <img
                          src={currentValue.url}
                          alt="Uploaded customer photo"
                          className="w-16 h-16 rounded-xl object-cover border border-[#ede1d3] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#241c18] truncate">
                            {currentValue.filename || 'Photo uploaded'}
                          </p>
                          <p className="text-[11px] text-[#2d7a46] flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" />
                            <span>Photo ready for customisation</span>
                          </p>
                          <div className="flex items-center gap-3 pt-1">
                            <label className="text-[11px] text-[#784d2f] font-semibold hover:underline cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(e) =>
                                  handleImageUpload(key, field.label, e.target.files?.[0])
                                }
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(key)}
                              className="text-[11px] text-red-600 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleImageUpload(key, field.label, e.dataTransfer.files?.[0]);
                        }}
                        className={`flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-[#fbf7f1] border-2 border-dashed border-[#d8c3ad] hover:border-[#784d2f] rounded-2xl px-4 py-5 text-center cursor-pointer transition-colors ${
                          uploadingField === key ? 'opacity-60 pointer-events-none' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#f4ebe0] text-[#784d2f] flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-[#241c18]">
                          {uploadingField === key
                            ? 'Uploading photo...'
                            : `Click or drag your photo here`}
                        </p>
                        <p className="text-[10px] text-[#8a7261]">
                          JPG, PNG or WEBP (high-resolution recommended)
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) =>
                            handleImageUpload(key, field.label, e.target.files?.[0])
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* 2. TEXT FIELD (e.g. Names, Initials, Phone) */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={currentValue || ''}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                )}

                {/* 3. TEXTAREA FIELD (e.g. Message, Quote, Notes) */}
                {field.type === 'textarea' && (
                  <textarea
                    rows={2}
                    value={currentValue || ''}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    placeholder={field.placeholder || 'Enter custom message or special requests...'}
                    required={field.required}
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f] resize-y"
                  />
                )}

                {/* 4. SELECT / DROPDOWN OPTIONS (e.g. Scent, Metal Finish, Size) */}
                {field.type === 'select' && (
                  <div>
                    {Array.isArray(field.options) && field.options.length <= 4 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {field.options.map((opt) => {
                          const optLabel = typeof opt === 'string' ? opt : opt.label;
                          const selected = currentValue === optLabel;
                          return (
                            <button
                              key={optLabel}
                              type="button"
                              onClick={() => handleTextChange(key, optLabel)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-[#784d2f] text-white border-[#784d2f] shadow-xs'
                                  : 'bg-white text-[#423328] border-[#dfcebd] hover:border-[#784d2f]'
                              }`}
                            >
                              {optLabel}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <select
                        value={currentValue || ''}
                        onChange={(e) => handleTextChange(key, e.target.value)}
                        required={field.required}
                        className="w-full bg-white border border-[#dfcebd] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                      >
                        <option value="">Select an option...</option>
                        {Array.isArray(field.options) &&
                          field.options.map((opt) => {
                            const optVal = typeof opt === 'string' ? opt : opt.label;
                            return (
                              <option key={optVal} value={optVal}>
                                {optVal}
                              </option>
                            );
                          })}
                      </select>
                    )}
                  </div>
                )}

                {/* 5. DATE PICKER */}
                {field.type === 'date' && (
                  <input
                    type="date"
                    value={currentValue || ''}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    required={field.required}
                    className="w-full bg-white border border-[#dfcebd] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#241c18] focus:outline-none focus:border-[#784d2f]"
                  />
                )}
              </div>
            );
          })}

          {/* Quantity Selector & Add Button */}
          <div className="pt-4 border-t border-[#f0e4d7] flex items-center justify-between gap-4">
            <div className="flex items-center border border-[#dfcebd] rounded-xl bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-xs font-bold text-[#543d2f] hover:bg-[#f4ebe0] cursor-pointer"
              >
                −
              </button>
              <span className="px-3 py-2 text-xs font-semibold text-[#241c18]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-xs font-bold text-[#543d2f] hover:bg-[#f4ebe0] cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              disabled={Boolean(uploadingField)}
              className="flex-1 bg-[#784d2f] hover:bg-[#623c22] text-white py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Cart with Personalisation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
