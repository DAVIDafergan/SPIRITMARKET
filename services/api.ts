import axios from 'axios';
import { Listing, ListingFilterParams, User } from '../types';

// הגדרת כתובת ה-API
const API_URL = '/api'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // Timeout של 60 שניות (חשוב ל-AI)
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor חכם לזיהוי הטוקן (התיקון לבעיית 401) ---
api.interceptors.request.use((config) => {
  let token: string | null = null;

  // 1. בדיקה אם הטוקן שמור ישירות כמחרוזת (בדרך כלל auth_token)
  const directToken = localStorage.getItem('auth_token');
  if (directToken) {
      token = directToken;
  } 
  // 2. בדיקה אם הטוקן נמצא בתוך אובייקט משתמש (spirit_market_user או user)
  else {
      const userStr = localStorage.getItem('spirit_market_user') || localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.token) token = user.token;
        } catch (e) {
          console.error("Error parsing user token", e);
        }
      }
  }

  // אם מצאנו טוקן - נצמיד אותו לבקשה
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // אופציונלי: לוג לאזהרה אם אין טוקן (אבל לא חוסם בקשות פומביות)
    // console.warn("No token found in LocalStorage.");
  }

  return config;
});

// טיפול בשגיאות גלובלי
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // לוג לשגיאות, עוזר בדיבוג
    console.error("API Error:", error.response?.data?.message || error.message);
    
    // אם מקבלים 401 (לא מורשה), אפשר להוסיף כאן לוגיקה לניקוי LocalStorage אם רוצים
    if (error.response?.status === 401) {
        console.error("Authentication failed. Token might be invalid.");
    }
    return Promise.reject(error);
  }
);

export const Api = {
  // --- אימות (Auth) ---
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    
    // שמירה חכמה: שומרים גם את הטוקן נקי וגם את המשתמש המלא
    // זה מבטיח תאימות לכל סוגי הקוד בפרויקט
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('spirit_market_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData: any): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    
    // גם כאן - שמירה כפולה
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('spirit_market_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getUserById: async (id: string) => {
     // פונקציה זו לא קיימת בשרת כרגע
     return null; 
  },

  // --- מודעות (Listings) ---
  getListings: async (filters?: ListingFilterParams): Promise<Listing[]> => {
    const response = await api.get('/listings', { params: filters });
    return response.data;
  },

  getListingByIdAndCountView: async (id: string | number): Promise<Listing> => {
    const response = await api.get(`/listings/${id}/view`);
    return response.data;
  },

  // תמיכה לאחור
  getListingById: async (id: string | number): Promise<Listing> => {
    const response = await api.get(`/listings/${id}/view`);
    return response.data;
  },

  createListing: async (data: any) => {
    // הפונקציה מצפה לאובייקט אחד מאוחד (כפי שתיקנו ב-CreateListing.tsx)
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
  simulateVertexAIPrediction: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/ai/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
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
  getModerationQueue: async () => {
      return [];
  },
  
  moderateListing: async (id: string, action: 'APPROVE' | 'REJECT') => {
      console.log(`Simulated moderation for ${id}: ${action}`);
  }
};