export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';


export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/verify-email`,
  PROFILE: `${API_BASE_URL}/api/user/profile`,
  PASSWORD: `${API_BASE_URL}/api/user/password`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  ADDRESSES: `${API_BASE_URL}/api/addresses`,
  ADMIN_ORDERS: `${API_BASE_URL}/api/admin/orders`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  WISHLIST: `${API_BASE_URL}/api/wishlist`
};
