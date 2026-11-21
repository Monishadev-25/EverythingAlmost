import { apiRequest } from './client';

export async function fetchProducts(params = {}, signal) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.min_price) query.set('min_price', params.min_price);
  if (params.max_price) query.set('max_price', params.max_price);
  if (params.in_stock !== undefined && params.in_stock !== null) query.set('in_stock', params.in_stock);
  if (params.q) query.set('q', params.q);
  if (params.sort) query.set('sort', params.sort);

  const queryString = query.toString() ? `?${query.toString()}` : '';

  const res = await apiRequest(`/products${queryString}`, { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function fetchFeaturedProducts(signal) {
  const res = await apiRequest('/products/featured', { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function fetchCategories(signal) {
  const res = await apiRequest('/products/categories', { signal });
  if (res?.data && typeof res.data === 'object') {
    return Object.entries(res.data).map(([name, count]) => ({ name, count }));
  }
  return [];
}

export async function fetchProductBySlug(slug, signal) {
  const res = await apiRequest(`/products/${slug}`, { signal });
  return res?.data || null;
}
