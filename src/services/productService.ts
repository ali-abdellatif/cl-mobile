import api from './api';

export const productService = {
  getHome: () => api.get('/home'),
  getCategories: () => api.get('/categories'),
  getProducts: (params?: {
    category_id?: number;
    country?: string;
    brand?: string;
    model?: string;
    page?: number;
  }) => api.get('/products', { params }),
  getProductDetails: (id: number) => api.get(`/products/${id}`),
  getBundles: () => api.get('/bundles'),
  getBestSellers: () => api.get('/products/best-sellers'),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
};
