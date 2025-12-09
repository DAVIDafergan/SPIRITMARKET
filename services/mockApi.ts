

import { Listing, ListingStatus, Category, AIAnalysisResult, User, CreateListingRequest, ListingFilterParams } from '../types';

// Mock Database - Users
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: 'שאטו קונוסייר',
    email: 'seller@example.com',
    password: 'password123',
    phone: '972500000001',
    isSeller: true,
    isAdmin: false,
    verified: true,
    rating: 5,
    joinedAt: new Date().toISOString()
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin',
    phone: '0000000000',
    isSeller: false,
    isAdmin: true,
    verified: true,
    rating: 5,
    joinedAt: new Date().toISOString()
  }
];

// Initial Mock Data in Hebrew
const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    sellerId: 'user1',
    sellerName: 'שאטו קונוסייר', // Chateau Connoisseur
    sellerPhone: '972500000001',
    sellerRating: 5,
    // FIX: Added missing property 'sellerVerified'
    sellerVerified: true,
    title: 'מקאלן 18 שנה שרי אוק', // Macallan 18 Year Old Sherry Oak
    description: 'סינגל מאלט קלאסי, מיושן אך ורק בחביות עץ אלון מתובלות בשרי מחוס מתקופת חרז. מצב בקבוק מושלם, נשמר בטמפרטורה מבוקרת.',
    price: 450,
    category: Category.WHISKEY,
    imageUrl: 'https://picsum.photos/400/600?random=1',
    status: ListingStatus.APPROVED,
    createdAt: new Date().toISOString(),
    location: 'תל אביב',
    abv: 43,
    volumeMl: 700,
    brand: 'Macallan',
    vintage: 2018,
    isKosher: true,
    aiData: { score: 0.98, labels: ['bottle', 'whiskey', 'label'], explanation: 'התאמה גבוהה למבנה בקבוק ויסקי ותווית ברורה.' }
  },
  {
    id: '2',
    sellerId: 'user2',
    sellerName: 'מרתף הכרם', // Vineyard Vault
    sellerPhone: '972500000002',
    sellerRating: 4.8,
    // FIX: Added missing property 'sellerVerified'
    sellerVerified: true,
    title: 'שאטו מרגו 2015', // Château Margaux 2015
    description: 'פרמייר גראנד קרו קלאסה. מצב מושלם, מאוחסן במרתף מבוקר אקלים. יין אדום עשיר ויוקרתי.',
    price: 1200,
    category: Category.WINE,
    imageUrl: 'https://picsum.photos/400/600?random=2',
    status: ListingStatus.APPROVED,
    createdAt: new Date().toISOString(),
    location: 'חיפה',
    abv: 13.5,
    volumeMl: 750,
    brand: 'Château Margaux',
    vintage: 2015,
    isKosher: false,
    aiData: { score: 0.95, labels: ['bottle', 'wine', 'red wine'], explanation: 'נראות תווית ברורה, פקק שלם.' }
  },
  {
    id: '3',
    sellerId: 'user3',
    sellerName: 'מוכר חדש',
    sellerPhone: '972500000003',
    sellerRating: 0,
    // FIX: Added missing property 'sellerVerified'
    sellerVerified: false,
    title: 'שיכר ביתי מיוחד', // Homemade "Special" Brew
    description: 'מתכון משפחתי, חזק מאוד. ללא תווית רשמית.',
    price: 50,
    category: Category.OTHER,
    imageUrl: 'https://picsum.photos/400/600?random=3',
    status: ListingStatus.NEEDS_REVIEW,
    createdAt: new Date().toISOString(),
    location: 'אילת',
    abv: 60,
    volumeMl: 1000,
    brand: 'Home Brew',
    vintage: 2023,
    isKosher: true,
    aiData: { score: 0.65, labels: ['bottle', 'liquid', 'unclear label'], explanation: 'הטקסט על התווית אינו קריא. נדרש אימות ידני.' }
  }
];

// Simulates API Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockApi = {
  // --- AUTH METHODS ---
  login: async (email: string, password: string): Promise<User> => {
    await delay(600);
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    // Return user without password, with fake token
    const { password: _, ...userSafe } = user;
    return { ...userSafe, token: 'mock-jwt-token-' + user.id };
  },

  register: async (userData: Partial<User>): Promise<User> => {
    await delay(800);
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === userData.email?.toLowerCase());
    if (exists) throw new Error('User already exists');

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'User',
      email: userData.email || '',
      password: userData.password, // In real app, hash this
      phone: userData.phone || '',
      isSeller: userData.isSeller || false,
      isAdmin: false,
      verified: false,
      rating: 0,
      joinedAt: new Date().toISOString()
    };

    MOCK_USERS.push(newUser);
    const { password: _, ...userSafe } = newUser;
    return { ...userSafe, token: 'mock-jwt-token-' + newUser.id };
  },

  getUserById: async (id: string): Promise<User | undefined> => {
     await delay(200);
     const user = MOCK_USERS.find(u => u.id === id);
     if(user) {
        const { password: _, ...userSafe } = user;
        return userSafe;
     }
     return undefined;
  },

  // --- LISTING METHODS ---

  getListings: async (filters?: ListingFilterParams): Promise<Listing[]> => {
    await delay(500);
    let results = [...MOCK_LISTINGS];

    // Filter by Approved status for general listing view
    results = results.filter(l => l.status === ListingStatus.APPROVED);

    if (filters) {
      if (filters.category && filters.category !== 'All') {
        results = results.filter(l => l.category === filters.category);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        results = results.filter(l => l.title.toLowerCase().includes(term));
      }
      if (filters.minPrice !== undefined) {
        results = results.filter(l => l.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter(l => l.price <= filters.maxPrice!);
      }
      if (filters.minAbv !== undefined) {
        results = results.filter(l => l.abv >= filters.minAbv!);
      }
      if (filters.maxAbv !== undefined) {
        results = results.filter(l => l.abv <= filters.maxAbv!);
      }
      if (filters.minRating !== undefined) {
        results = results.filter(l => (l.sellerRating || 0) >= filters.minRating!);
      }

      // Sorting
      if (filters.sortBy) {
        results.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price_asc':
              return a.price - b.price;
            case 'price_desc':
              return b.price - a.price;
            case 'rating_desc':
              return (b.sellerRating || 0) - (a.sellerRating || 0);
            case 'date_desc':
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
      }
    }
    
    return results;
  },

  getListingById: async (id: string): Promise<Listing | undefined> => {
    await delay(300);
    return MOCK_LISTINGS.find(l => l.id === id);
  },

  // Simulates Vertex AI Image Prediction
  simulateVertexAIPrediction: async (file: File): Promise<AIAnalysisResult> => {
    await delay(2500); // Simulate processing time

    // Deterministic mock based on file size just to vary results in demo
    const randomSeed = file.size % 100;
    
    if (randomSeed < 10) {
      // Simulation: Not alcohol / Blocked
      return {
        score: 0.2,
        labels: ['person', 'outdoor', 'unknown object'],
        explanation: 'Object does not resemble a bottle or recognized packaging.'
      };
    } else if (randomSeed < 40) {
      // Simulation: Uncertain / Needs Review
      return {
        score: 0.60,
        labels: ['glass', 'liquid', 'blurry'],
        explanation: 'Bottle detected but label is obscured or glare is present.'
      };
    } else {
      // Simulation: Approved
      return {
        score: 0.92,
        labels: ['bottle', 'alcohol', 'clear label'],
        explanation: 'Positive identification of standard alcohol packaging.'
      };
    }
  },

  createListing: async (listing: CreateListingRequest, aiResult: AIAnalysisResult): Promise<Listing> => {
    await delay(800);
    
    // Simulate SQL "Session" retrieval to get the seller
    // In a real app, the backend decodes the JWT token.
    const storedUser = localStorage.getItem('user_data');
    const currentUser = storedUser ? JSON.parse(storedUser) : MOCK_USERS[0];

    // Auto-moderation logic
    let status = ListingStatus.PENDING;
    if (aiResult.score >= 0.75) status = ListingStatus.APPROVED;
    else if (aiResult.score >= 0.5) status = ListingStatus.NEEDS_REVIEW;
    else status = ListingStatus.REJECTED;

    const newListing: Listing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status,
      aiData: aiResult,
      // Simulate SQL Foreign Key Join
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.phone,
      sellerRating: currentUser.rating,
      // FIX: Added missing property 'sellerVerified'
      sellerVerified: currentUser.verified
    };

    MOCK_LISTINGS.unshift(newListing);
    return newListing;
  },

  // For Admin Dashboard
  getModerationQueue: async (): Promise<Listing[]> => {
    await delay(500);
    return MOCK_LISTINGS.filter(l => l.status === ListingStatus.NEEDS_REVIEW);
  },

  moderateListing: async (id: string, action: 'APPROVE' | 'REJECT'): Promise<void> => {
    await delay(500);
    const idx = MOCK_LISTINGS.findIndex(l => l.id === id);
    if (idx !== -1) {
      MOCK_LISTINGS[idx].status = action === 'APPROVE' ? ListingStatus.APPROVED : ListingStatus.REJECTED;
    }
  }
};