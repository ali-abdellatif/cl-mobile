import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: number, quantity: number = 1) =>
    api.post('/cart', { product_id: productId, quantity }),
  updateQuantity: (cartItemId: number, quantity: number) =>
    api.put(`/cart/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId: number) =>
    api.delete(`/cart/${cartItemId}`),
  clearCart: () => api.delete('/cart'),
};
