

export enum ListingStatus {
  PENDING = 'PENDING', // Uploading/Analyzing
  APPROVED = 'APPROVED', // AI High Confidence
  NEEDS_REVIEW = 'NEEDS_REVIEW', // AI Medium Confidence
  REJECTED = 'REJECTED', // AI Low Confidence or Admin Rejected
  SOLD = 'SOLD'
}

export enum Category {
  WINE = 'Wine',
  WHISKEY = 'Whiskey',
  VODKA = 'Vodka',
  RUM = 'Rum',
  GIN = 'Gin',
  TEQUILA = 'Tequila',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Only for mock DB usage, not exposed in UI
  token?: string; // JWT for authenticated requests
  isSeller: boolean;
  isAdmin: boolean;
  verified: boolean;
  rating: number;
  joinedAt: string;
}

export interface AIAnalysisResult {
  score: number; // 0.0 to 1.0
  labels: string[];
  detectedText?: string;
  explanation?: string;
}

// The Entity (Matches SQL Table Structure + Joined User Data)
export interface Listing {
  id: string;
  sellerId: string; // Foreign Key to Users table
  sellerName: string; // Joined from Users table
  sellerPhone: string; // Joined from Users table
  sellerRating?: number; // Joined from Users table
  sellerVerified: boolean; // Joined from Users table
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  status: ListingStatus;
  aiData?: AIAnalysisResult; // Stored as JSONB in SQL
  createdAt: string;
  location: string;
  abv: number; 
  volumeMl: number;
  brand: string;
  vintage: number;
  isKosher: boolean;
}

// The Request DTO (What the frontend sends to the backend)
export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  location: string;
  abv: number;
  volumeMl: number;
  brand: string;
  vintage: number;
  isKosher: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ListingFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minAbv?: number;
  maxAbv?: number;
  minRating?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'rating_desc';
}