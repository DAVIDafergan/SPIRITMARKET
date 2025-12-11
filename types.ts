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

/**
 * ממשק לייצוג דירוג וביקורת שהוגשו על ידי משתמש.
 * משמש לביקורת על מוצר ספציפי או על מוכר.
 */
export interface Review {
  id: string;
  // ייתכן שנשתמש בשדה זה לדירוג מוכר עבור עסקת מוצר ספציפית:
  listingId: string; // מזהה המוצר שעליו נכתבה הביקורת/דירוג
  sellerId: string; // מזהה המוכר
  reviewerId: string; // מזהה המשתמש שכתב את הביקורת
  reviewerName: string; // שם המשתמש (Joined)
  rating: number; // הדירוג המספרי (1-5 כוכבים) - דירוג המוכר
  comment: string; // תוכן הביקורת
  createdAt: string;
}

/**
 * ממשק לייצוג נתוני דירוג כלליים של מוכר.
 */
export interface SellerRating {
  sellerId: string;
  averageRating: number; // ממוצע הדירוגים שהתקבלו
  totalReviews: number; // סך הביקורות שהתקבלו
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
  rating: number; // דירוג ממוצע (כנראה נשלף מטבלת SellerRating)
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
  sellerRating?: number; // Joined from Users table (הערך הממוצע)
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

  // --- שדות חדשים ---
  viewCount: number; // מספר הצפיות
  reviews: Review[]; // מערך הביקורות על מוצר זה
  // ----------------
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

// DTO לעדכון ליסטינג קיים (עבור pages/EditListing.tsx)
export interface UpdateListingRequest {
  title: string;
  description: string;
  price: number;
  category: Category;
  location: string;
  abv: number;
  volumeMl: number;
  brand: string;
  vintage: number;
  isKosher: boolean;
}

// DTO להגשת ביקורת חדשה (כולל דירוג מוכר)
export interface SubmitReviewRequest {
    listingId: string;
    sellerId: string;
    rating: number; // 1-5 כוכבים
    comment: string;
}

// DTO לעדכון פרטי המשתמש (עבור pages/Account.tsx)
export interface UpdateUserRequest {
    name: string;
    phone: string;
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