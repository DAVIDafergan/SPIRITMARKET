
import { Listing, User, AIAnalysisResult, CreateListingRequest, ListingFilterParams } from '../types';
import { MockApi } from './mockApi';
import { config } from '../config';

// Interface defining the contract for both Mock and Real services
interface ApiService {
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Partial<User>) => Promise<User>;
  getUserById: (id: string) => Promise<User | undefined>;
  getListings: (filters?: ListingFilterParams) => Promise<Listing[]>;
  getListingById: (id: string) => Promise<Listing | undefined>;
  createListing: (listing: CreateListingRequest, aiResult: AIAnalysisResult) => Promise<Listing>;
  simulateVertexAIPrediction: (file: File) => Promise<AIAnalysisResult>;
  getModerationQueue: () => Promise<Listing[]>;
  moderateListing: (id: string, action: 'APPROVE' | 'REJECT') => Promise<void>;
}

// Helper to get headers with Auth Token
const getHeaders = (contentType: string | null = 'application/json') => {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to safely parse JSON response
const handleResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Error');
    }
    return data;
  } else {
    // If response is not JSON (e.g., HTML 404 or 500), read as text to debug
    const text = await res.text();
    if (!res.ok) {
      console.error("API returned non-JSON error:", text);
      throw new Error(`Server Error (${res.status}): Please check connection.`);
    }
    return text; 
  }
};

// Real API Implementation (fetch based)
const RealApi: ApiService = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(res);
    } catch (e) {
      console.error("Login Error:", e);
      throw e;
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${config.apiUrl}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return await handleResponse(res);
    } catch (e) {
      console.error("Register Error:", e);
      throw e;
    }
  },

  getUserById: async (id) => {
    try {
      const res = await fetch(`${config.apiUrl}/users/${id}`, {
          headers: getHeaders()
      });
      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  },

  getListings: async (filters) => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minAbv) params.append('minAbv', filters.minAbv.toString());
      if (filters.maxAbv) params.append('maxAbv', filters.maxAbv.toString());
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
    }

    try {
      const res = await fetch(`${config.apiUrl}/listings?${params.toString()}`);
      return await handleResponse(res);
    } catch (e) {
      console.error("Fetch Listings Error:", e);
      throw new Error('Failed to load listings. Server might be offline.');
    }
  },

  getListingById: async (id) => {
    try {
      const res = await fetch(`${config.apiUrl}/listings/${id}`);
      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  },

  createListing: async (listing, aiResult) => {
    try {
      const res = await fetch(`${config.apiUrl}/listings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...listing, aiData: aiResult }),
      });
      return await handleResponse(res);
    } catch (e) {
      console.error("Create Listing Error:", e);
      throw e;
    }
  },

  simulateVertexAIPrediction: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch(`${config.apiUrl}/ai/verify`, {
        method: 'POST',
        headers: getHeaders(null), // Remove Content-Type for FormData
        body: formData,
      });
      return await handleResponse(res);
    } catch (e) {
      console.error("AI Verify Error:", e);
      throw e;
    }
  },

  getModerationQueue: async () => {
    const res = await fetch(`${config.apiUrl}/admin/moderation`, {
        headers: getHeaders()
    });
    return await handleResponse(res);
  },

  moderateListing: async (id, action) => {
    const res = await fetch(`${config.apiUrl}/admin/moderation/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action }),
    });
    await handleResponse(res);
  }
};

// Export the selected strategy based on config
export const Api = config.useMock ? MockApi : RealApi;