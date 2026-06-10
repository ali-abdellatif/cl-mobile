import api from './api';

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: {
    email: string;
    name: string;
    phone: string;
    region: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  verifyOTP: (email: string, otp: string) =>
    api.post('/auth/verify-otp', { email, otp }),

  resetPassword: (data: {
    email: string;
    otp: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/auth/reset-password', data),

  setCarType: (data: {
    country: string;
    brand: string;
    model: string;
  }) => api.post('/user/car-type', data),

  logout: () => api.post('/auth/logout'),
};
