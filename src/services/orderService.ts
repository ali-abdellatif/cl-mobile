import api from './api';

export const orderService = {
  placeOrder: (data: {
    address: string;
    building: string;
    floor: string;
    payment_method: 'bank_card' | 'cash' | 'halan';
    card_number?: string;
    card_holder?: string;
    expiry?: string;
    cvv?: string;
  }) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderDetails: (id: number) => api.get(`/orders/${id}`),
  getCurrentOrders: () => api.get('/orders?status=current'),
  getPreviousOrders: () => api.get('/orders?status=previous'),
};
