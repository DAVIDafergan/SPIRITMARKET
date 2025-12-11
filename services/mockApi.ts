import { 
    Listing, 
    ListingStatus, 
    Category, 
    AIAnalysisResult, 
    User, 
    CreateListingRequest, 
    ListingFilterParams,
    UpdateListingRequest,
    SubmitReviewRequest,
    Review 
} from '../types';

// פונקציית עזר לשליפת המשתמש המחובר (סימולציית פענוח טוקן)
const getCurrentUser = (): User => {
    // ב-Mock, נניח שהמשתמש הראשון הוא המחובר אם אין נתונים ב-localStorage
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    // ברירת מחדל: המוכר הראשי
    return MOCK_USERS[0]; 
};


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
    joinedAt: new Date(2023, 1, 1).toISOString()
  },
  {
    id: 'user2',
    name: 'מרתף הכרם', // Vineyard Vault (הוספתי אותו לרשימת המשתמשים הפיקטיביים)
    email: 'seller2@example.com',
    password: 'password123',
    phone: '972500000002',
    isSeller: true,
    isAdmin: false,
    verified: true,
    rating: 4.8,
    joinedAt: new Date(2023, 5, 15).toISOString()
  },
  {
    id: 'user3',
    name: 'מוכר חדש',
    email: 'new_seller@example.com',
    password: 'password123',
    phone: '972500000003',
    isSeller: true,
    isAdmin: false,
    verified: false,
    rating: 0,
    joinedAt: new Date(2024, 1, 1).toISOString()
  },
  {
    id: 'reviewer4', // משתמש שרק משאיר ביקורות
    name: 'מבקר מחמיר',
    email: 'reviewer@example.com',
    password: 'password123',
    phone: '972500000004',
    isSeller: false,
    isAdmin: false,
    verified: true,
    rating: 0,
    joinedAt: new Date(2023, 10, 10).toISOString()
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

// Mock Database - Reviews
let MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        listingId: '1',
        sellerId: 'user1',
        reviewerId: 'reviewer4',
        reviewerName: 'מבקר מחמיר',
        rating: 5,
        comment: 'שירות מעולה! המשלוח הגיע ארוז היטב תוך יום אחד. מומלץ בחום.',
        createdAt: new Date(2024, 10, 1).toISOString(),
    },
    {
        id: 'r2',
        listingId: '2',
        sellerId: 'user2',
        reviewerId: 'user1',
        reviewerName: 'שאטו קונוסייר',
        rating: 4,
        comment: 'הבקבוק הגיע בדיוק כמתואר, המוכר היה אדיב ומקצועי.',
        createdAt: new Date(2024, 10, 5).toISOString(),
    },
    {
        id: 'r3',
        listingId: '1',
        sellerId: 'user1',
        reviewerId: 'user2',
        reviewerName: 'מרתף הכרם',
        rating: 5,
        comment: 'מוכר אמין ביותר, חווית קנייה נהדרת.',
        createdAt: new Date(2024, 11, 1).toISOString(),
    },
];


// Initial Mock Data in Hebrew
let MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    sellerId: 'user1',
    sellerName: 'שאטו קונוסייר', // Chateau Connoisseur
    sellerPhone: '972500000001',
    sellerRating: 5,
    sellerVerified: true,
    title: 'מקאלן 18 שנה שרי אוק', // Macallan 18 Year Old Sherry Oak
    description: 'סינגל מאלט קלאסי, מיושן אך ורק בחביות עץ אלון מתובלות בשרי מחוס מתקופת חרז. מצב בקבוק מושלם, נשמר בטמפרטורה מבוקרת.',
    price: 450,
    category: Category.WHISKEY,
    imageUrl: 'https://picsum.photos/400/600?random=1',
    status: ListingStatus.APPROVED,
    createdAt: new Date(2024, 10, 1).toISOString(),
    location: 'תל אביב',
    abv: 43,
    volumeMl: 700,
    brand: 'Macallan',
    vintage: 2018,
    isKosher: true,
    aiData: { score: 0.98, labels: ['bottle', 'whiskey', 'label'], explanation: 'התאמה גבוהה למבנה בקבוק ויסקי ותווית ברורה.' },
    // --- שדות חדשים ---
    viewCount: 150,
    reviews: MOCK_REVIEWS.filter(r => r.listingId === '1'),
  },
  {
    id: '2',
    sellerId: 'user2',
    sellerName: 'מרתף הכרם', // Vineyard Vault
    sellerPhone: '972500000002',
    sellerRating: 4.8,
    sellerVerified: true,
    title: 'שאטו מרגו 2015', // Château Margaux 2015
    description: 'פרמייר גראנד קרו קלאסה. מצב מושלם, מאוחסן במרתף מבוקר אקלים. יין אדום עשיר ויוקרתי.',
    price: 1200,
    category: Category.WINE,
    imageUrl: 'https://picsum.photos/400/600?random=2',
    status: ListingStatus.APPROVED,
    createdAt: new Date(2024, 9, 15).toISOString(),
    location: 'חיפה',
    abv: 13.5,
    volumeMl: 750,
    brand: 'Château Margaux',
    vintage: 2015,
    isKosher: false,
    aiData: { score: 0.95, labels: ['bottle', 'wine', 'red wine'], explanation: 'נראות תווית ברורה, פקק שלם.' },
    // --- שדות חדשים ---
    viewCount: 45,
    reviews: MOCK_REVIEWS.filter(r => r.listingId === '2'),
  },
  {
    id: '3',
    sellerId: 'user3',
    sellerName: 'מוכר חדש',
    sellerPhone: '972500000003',
    sellerRating: 0,
    sellerVerified: false,
    title: 'שיכר ביתי מיוחד', // Homemade "Special" Brew
    description: 'מתכון משפחתי, חזק מאוד. ללא תווית רשמית.',
    price: 50,
    category: Category.OTHER,
    imageUrl: 'https://picsum.photos/400/600?random=3',
    status: ListingStatus.NEEDS_REVIEW,
    createdAt: new Date(2024, 11, 5).toISOString(),
    location: 'אילת',
    abv: 60,
    volumeMl: 1000,
    brand: 'Home Brew',
    vintage: 2023,
    isKosher: true,
    aiData: { score: 0.65, labels: ['bottle', 'liquid', 'unclear label'], explanation: 'הטקסט על התווית אינו קריא. נדרש אימות ידני.' },
    // --- שדות חדשים ---
    viewCount: 12,
    reviews: [],
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
    // שמור את פרטי המשתמש לצורך שימוש ב-getCurrentUser
    localStorage.setItem('user_data', JSON.stringify(userSafe)); 
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

  // --- חדש: עדכון משתמש ---
  updateCurrentUser: async (userData: { name: string, phone: string }): Promise<User> => {
    await delay(500);
    const currentUser = getCurrentUser();
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User not found.');

    // עדכן את הפרטים
    MOCK_USERS[userIndex].name = userData.name;
    MOCK_USERS[userIndex].phone = userData.phone;

    const updatedUser = MOCK_USERS[userIndex];
    const { password: _, ...userSafe } = updatedUser;
    
    // עדכן את ה-LocalStorage כדי לשמור על עקביות ב-AuthContext
    localStorage.setItem('user_data', JSON.stringify(userSafe)); 
    
    return { ...userSafe, token: 'mock-jwt-token-' + updatedUser.id };
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
        // לצורך Mock, נשתמש בדירוג הקיים
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
    const listingIndex = MOCK_LISTINGS.findIndex(l => l.id === id);
    if (listingIndex !== -1) {
        // סימולציית מניית צפיות
        MOCK_LISTINGS[listingIndex].viewCount = (MOCK_LISTINGS[listingIndex].viewCount || 0) + 1;
        return MOCK_LISTINGS[listingIndex];
    }
    return undefined;
  },

  // --- חדש: שליפת ליסטינגים אישיים ---
  getMyListings: async (): Promise<Listing[]> => {
    await delay(400);
    const currentUser = getCurrentUser();
    // שליפת כל הליסטינגים של המשתמש, כולל אלה שעדיין בבדיקה/נדחו
    return MOCK_LISTINGS.filter(l => l.sellerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // --- חדש: עדכון ליסטינג ---
  updateListing: async (id: string, listing: UpdateListingRequest): Promise<Listing> => {
    await delay(700);
    const listingIndex = MOCK_LISTINGS.findIndex(l => l.id === id);
    if (listingIndex === -1) throw new Error('Listing not found');

    const updatedListing = {
        ...MOCK_LISTINGS[listingIndex],
        ...listing,
        // ניתן להוסיף כאן לוגיקה לעדכון סטטוס בהתאם לשינויים
    };
    MOCK_LISTINGS[listingIndex] = updatedListing;
    return updatedListing;
  },

  // --- חדש: מחיקת ליסטינג ---
  deleteListing: async (id: string): Promise<void> => {
    await delay(500);
    const initialLength = MOCK_LISTINGS.length;
    MOCK_LISTINGS = MOCK_LISTINGS.filter(l => l.id !== id);
    if (MOCK_LISTINGS.length === initialLength) {
        throw new Error('Listing not found for deletion.');
    }
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
    
    const currentUser = getCurrentUser();

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
      sellerVerified: currentUser.verified,
      // --- שדות חדשים ---
      viewCount: 0,
      reviews: [],
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
  },

  // --- חדש: הוספת ביקורת ודירוג ---
  addReview: async (reviewData: SubmitReviewRequest): Promise<Review> => {
    await delay(700);
    const currentUser = getCurrentUser();
    
    // יצירת אובייקט הביקורת
    const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        listingId: reviewData.listingId,
        sellerId: reviewData.sellerId,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
    };
    
    // 1. שמור בבסיס הנתונים (Mock)
    MOCK_REVIEWS.push(newReview);
    
    // 2. עדכן את הליסטינג המושפע
    const listingIndex = MOCK_LISTINGS.findIndex(l => l.id === reviewData.listingId);
    if (listingIndex !== -1) {
        MOCK_LISTINGS[listingIndex].reviews.push(newReview);
    }
    
    // 3. עדכן את הדירוג הממוצע של המוכר (בצורה פשטנית עבור Mock)
    const sellerReviews = MOCK_REVIEWS.filter(r => r.sellerId === reviewData.sellerId);
    const totalRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / sellerReviews.length;
    
    const sellerIndex = MOCK_USERS.findIndex(u => u.id === reviewData.sellerId);
    if (sellerIndex !== -1) {
        MOCK_USERS[sellerIndex].rating = parseFloat(averageRating.toFixed(1));
    }

    // 4. החזר את הביקורת החדשה
    return newReview;
  },

  // --- חדש: שליפת ביקורות למוכר ---
  getReviewsBySeller: async (sellerId: string): Promise<Review[]> => {
    await delay(300);
    return MOCK_REVIEWS.filter(r => r.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};