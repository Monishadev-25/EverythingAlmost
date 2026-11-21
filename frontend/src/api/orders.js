import { apiRequest } from './client';

export async function createOrder(orderPayload) {
  const res = await apiRequest('/orders', {
    method: 'POST',
    body: orderPayload,
  });
  return res.order;
}

export async function fetchMyOrders(signal) {
  const res = await apiRequest('/orders', { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function fetchOrderByNumber(orderNumber, signal) {
  const res = await apiRequest(`/orders/${orderNumber}`, { signal });
  return res?.order || null;
}

export async function uploadCustomImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await apiRequest('/upload-custom-image', {
    method: 'POST',
    body: formData,
  });
  return res;
}
