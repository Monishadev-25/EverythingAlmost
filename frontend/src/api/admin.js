import { apiRequest } from './client';

export async function fetchAdminStats(signal) {
  const res = await apiRequest('/admin/stats', { signal });
  return (
    res || {
      total_revenue: 0,
      orders_count: 0,
      paid_orders: 0,
      pending_orders: 0,
      refunded_orders: 0,
      products_count: 0,
      recent_orders: [],
    }
  );
}

export async function fetchAdminProducts(params = {}, signal) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  const queryString = query.toString() ? `?${query.toString()}` : '';

  const res = await apiRequest(`/admin/products${queryString}`, { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function createAdminProduct(payload) {
  const res = await apiRequest('/admin/products', {
    method: 'POST',
    body: payload,
  });
  return res?.data;
}

export async function updateAdminProduct(id, payload) {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  if (isFormData) {
    payload.set('_method', 'PUT');
    const res = await apiRequest(`/admin/products/${id}`, {
      method: 'POST',
      body: payload,
    });
    return res?.data;
  }

  const res = await apiRequest(`/admin/products/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return res?.data;
}

export async function deleteAdminProduct(id) {
  return apiRequest(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchAdminOrders(params = {}, signal) {
  const query = new URLSearchParams();
  if (params.payment_status && params.payment_status !== 'All') {
    query.set('payment_status', params.payment_status);
  }
  if (params.status && params.status !== 'All') {
    query.set('status', params.status);
  }
  if (params.q) query.set('q', params.q);
  const queryString = query.toString() ? `?${query.toString()}` : '';

  const res = await apiRequest(`/admin/orders${queryString}`, { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function updateAdminPaymentStatus(orderId, paymentStatus, notes = '') {
  const res = await apiRequest(`/admin/orders/${orderId}/payment`, {
    method: 'PUT',
    body: { payment_status: paymentStatus, notes },
  });
  return res?.order;
}

export async function updateAdminOrderStatus(orderId, status) {
  const res = await apiRequest(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: { status },
  });
  return res?.order;
}
