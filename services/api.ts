import axios from 'axios';
import { Listing, ListingFilterParams, User } from '../types';

// הגדרת כתובת ה-API
// אם אתה עובד לוקאלית והשרת רץ על 8080 והריאקט על 5173, מומלץ להשתמש ב-Proxy ב-Vite
// או לכתוב כאן את הכתובת המלאה: 'http://localhost:8080/api'
const API_URL = '/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: הוספת הטוקן לכל בקשה באופן אוטומטי
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('spirit_market_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Error parsing user from local storage", e);
    }
  }
  return config;
});

// Interceptor: טיפול בשגיאות גלובלי (אופציונלי)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const Api = {
  // --- אימות (Auth) ---
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getUserById: async (id: string) => {
     // פונקציה זו לא קיימת ב-server.js הנוכחי, אך נשאיר למניעת שגיאות קומפילציה
     // כרגע נחזיר null או נשתמש במידע שיש ב-localStorage
     return null; 
  },

  // --- מודעות (Listings) ---
  getListings: async (filters?: ListingFilterParams): Promise<Listing[]> => {
    const response = await api.get('/listings', { params: filters });
    return response.data;
  },

  // 🚨 התיקון הקריטי: הפונקציה שחסרה וגרמה לקריסה בדף המוצר 🚨
  getListingByIdAndCountView: async (id: string | number): Promise<Listing> => {
    const response = await api.get(`/listings/${id}/view`);
    return response.data;
  },

  // תמיכה לאחור בקוד ישן שאולי קורא לזה
  getListingById: async (id: string | number): Promise<Listing> => {
    const response = await api.get(`/listings/${id}/view`);
    return response.data;
  },

  createListing: async (data: any) => {
    const response = await api.post('/listings', data);
    return response.data;
  },

  updateListing: async (id: number, data: any) => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: number) => {
    await api.delete(`/listings/${id}`);
  },

  getMyListings: async (): Promise<Listing[]> => {
    const response = await api.get('/listings/my');
    return response.data;
  },

  // --- AI / העלאת תמונות ---
  // מיפוי הפונקציה הישנה simulateVertexAIPrediction לפונקציה החדשה
  simulateVertexAIPrediction: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/ai/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // שם חדש וברור יותר לאותה פעולה
  uploadImage: async (formData: FormData) => {
    const response = await api.post('/ai/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // --- משתמשים וביקורות ---
  updateUserProfile: async (data: { name: string; phone: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  addReview: async (data: { listingId: number; sellerId: number; rating: number; comment: string }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getSellerReviews: async (sellerId: number) => {
    const response = await api.get(`/reviews/seller/${sellerId}`);
    return response.data;
  },
  
  // --- Admin (Placeholder) ---
  // הפונקציות האלו לא קיימות בשרת כרגע, משאיר ריק כדי למנוע קריסה אם יש קריאה
  getModerationQueue: async () => {
      return [];
  },
  
  moderateListing: async (id: string, action: 'APPROVE' | 'REJECT') => {
      console.log(`Simulated moderation for ${id}: ${action}`);
  }
};