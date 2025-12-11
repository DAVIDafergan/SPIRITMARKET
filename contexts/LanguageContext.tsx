import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'he';

export const translations = {
  en: {
    nav: {
      market: 'Marketplace',
      moderation: 'Moderation',
      sell: 'Sell Bottle',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      welcome: 'Hello',
      // --- חדש: ניווט אישי ---
      myAccount: 'My Account',
      myListings: 'My Listings',
      // ---------------------
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Create Account',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submitLogin: 'Sign In',
      submitRegister: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      registerLink: "Sign up",
      loginLink: "Log in",
      error: 'Invalid email or password',
      successRegister: 'Registration successful! Please login.',
      passMismatch: 'Passwords do not match',
      sellerToggle: 'I want to sell alcohol',
      // --- חדש: עדכון פרופיל ---
      updateProfile: 'Update Profile',
      updateSuccess: 'Profile updated successfully!',
      updateError: 'Failed to update profile.',
      // -------------------------
    },
    hero: {
      title: 'Discover Rare & Fine Spirits',
      subtitle: 'Buy and sell verified alcohol collectibles. From vintage wines to limited edition whiskeys.',
      searchPlaceholder: 'Search for Macallan, Bordeaux, etc...',
    },
    filters: {
      filterBy: 'Filter by:',
      clear: 'Clear filters',
      noListings: 'No listings found matching your criteria.',
      all: 'All',
      advanced: 'Advanced Filters',
      priceRange: 'Price Range',
      abvRange: 'ABV %',
      sellerRating: 'Min Seller Rating',
      min: 'Min',
      max: 'Max',
      stars: 'Stars',
      apply: 'Apply Filters',
      sortBy: 'Sort By',
      sortOptions: {
        date_desc: 'Newest',
        price_asc: 'Price: Low to High',
        price_desc: 'Price: High to Low',
        rating_desc: 'Seller Rating'
      },
      categories: {
        Wine: 'Wine',
        Whiskey: 'Whiskey',
        Vodka: 'Vodka',
        Rum: 'Rum',
        Gin: 'Gin',
        Tequila: 'Tequila',
        Other: 'Other'
      }
    },
    listing: {
      verified: 'Verified',
      location: 'Location',
      price: 'Price',
      date: 'Date',
      currency: 'USD'
    },
    create: {
      title: 'List a Bottle',
      subtitle: 'Our AI will verify your image for authenticity.',
      uploadLabel: 'Product Image (Required)',
      clickUpload: 'Click to upload or drag and drop',
      uploadHint: 'Clear photo of the bottle & label. PNG, JPG up to 10MB',
      remove: 'Remove & Upload Different',
      analyzing: 'Vertex AI is analyzing your image structure and label...',
      aiResult: 'AI Analysis Result',
      aiReview: 'Review Needed: Low confidence.',
      aiReject: 'Rejected: Image invalid.',
      aiVerify: 'Verified: High confidence.',
      loginRequired: 'You must be logged in to create a listing.',
      loginBtn: 'Login to Continue',
      form: {
        title: 'Title',
        desc: 'Description',
        price: 'Price (USD)',
        category: 'Category',
        abv: 'ABV (%)',
        volume: 'Volume (ml)',
        location: 'Location',
        submit: 'Submit Listing',
        brand: 'Winery / Brand',
        vintage: 'Vintage Year',
        kosher: 'Kosher',
        isKosher: 'This product is Kosher',
      }
    },
    detail: {
      verifiedAuth: 'Verified Authenticity',
      sellerInfo: 'Seller Information',
      verifiedSeller: 'Verified Seller',
      whatsapp: 'WhatsApp Seller',
      call: 'Call Seller',
      safety: 'Always meet in a safe public location or verify shipping details carefully.',
      volume: 'Volume',
      abv: 'ABV',
      brand: 'Winery / Brand',
      vintage: 'Vintage',
      kosher: 'Kosher Certified',
      // --- חדש: דירוג וצפיות ---
      viewCount: 'Views',
      reviews: 'Reviews & Rating',
      reviewFormTitle: 'Rate & Review Seller',
      submitReview: 'Submit Review',
      reviewPlaceholder: 'Write your comment here...',
      rateLabel: 'Rate the Seller (1-5 stars)',
      noReviews: 'No reviews yet. Be the first to rate this seller!',
      reviewSuccess: 'Review submitted successfully!',
      reviewError: 'Failed to submit review.',
      // -------------------------
    },
    // --- חדש: דפי ניהול ---
    account: {
        title: 'My Account Dashboard',
        subtitle: 'Update your personal details and manage your activities.',
        myDetails: 'My Details',
        manageListings: 'Manage My Listings',
        wishlist: 'Wishlist',
        updateBtn: 'Update Details',
    },
    myListings: {
        title: 'My Listings',
        subtitle: 'Manage, edit, and delete bottles you currently have listed for sale.',
        edit: 'Edit',
        delete: 'Delete',
        confirmDeleteTitle: 'Confirm Deletion',
        confirmDeleteText: 'Are you sure you want to delete this listing? This action cannot be undone.',
        deleteSuccess: 'Listing deleted successfully!',
        deleteError: 'Failed to delete listing.',
        noListings: "You haven't listed any items yet.",
    },
    editListing: {
        title: 'Edit Listing',
        updateBtn: 'Update Listing',
        updateSuccess: 'Listing updated successfully!',
        updateError: 'Failed to update listing.',
    },
    // ---------------------
    admin: {
      title: 'Moderation Dashboard',
      subtitle: 'Overview of verification queue and system health.',
      systemOp: 'System Operational',
      statusOverview: 'Listing Status Overview',
      humanLoop: 'Human-in-the-Loop Protocol',
      humanLoopText: 'Items with AI confidence scores between 0.50 and 0.75 are flagged for human review.',
      needsReview: 'Needs Review',
      emptyQueue: 'All caught up! The moderation queue is empty.',
      approve: 'Approve',
      reject: 'Reject',
      aiAnalysis: 'AI Analysis',
      seller: 'Seller',
      price: 'Price',
      aiScore: 'AI Score'
    },
    ageVerification: {
      title: 'Age Verification',
      subtitle: 'You must be of legal drinking age to enter this site.',
      confirm: 'I am 18 years or older',
      exit: 'Exit',
      disclaimer: 'By entering, you agree to our Terms of Service and Privacy Policy.',
    }
  },
  he: {
    nav: {
      market: 'השוק',
      moderation: 'ניהול',
      sell: 'מכירה',
      login: 'התחברות',
      register: 'הרשמה',
      logout: 'התנתק',
      profile: 'פרופיל',
      welcome: 'שלום',
      // --- חדש: ניווט אישי ---
      myAccount: 'האיזור האישי',
      myListings: 'המודעות שלי',
      // ---------------------
    },
    auth: {
      loginTitle: 'ברוכים הבאים',
      registerTitle: 'יצירת חשבון',
      name: 'שם מלא',
      email: 'כתובת אימייל',
      phone: 'מספר טלפון',
      password: 'סיסמה',
      confirmPassword: 'אימות סיסמה',
      submitLogin: 'התחבר',
      submitRegister: 'הרשם',
      noAccount: "אין לך חשבון?",
      hasAccount: "יש לך חשבון?",
      registerLink: "הירשם עכשיו",
      loginLink: "התחבר כאן",
      error: 'אימייל או סיסמה שגויים',
      successRegister: 'ההרשמה הצליחה! אנא התחבר.',
      passMismatch: 'הסיסמאות אינן תואמות',
      sellerToggle: 'אני מעוניין למכור אלכוהול',
      // --- חדש: עדכון פרופיל ---
      updateProfile: 'עדכון פרופיל',
      updateSuccess: 'הפרופיל עודכן בהצלחה!',
      updateError: 'העדכון נכשל.',
      // -------------------------
    },
    hero: {
      title: 'גלה משקאות נדירים ומשובחים',
      subtitle: 'קנה ומכור פריטי אספנות מאומתים. מיינות בציר ועד וויסקי במהדורה מוגבלת.',
      searchPlaceholder: 'חיפוש מקאלן, בורדו, וכו\'...',
    },
    filters: {
      filterBy: 'סינון לפי:',
      clear: 'נקה מסננים',
      noListings: 'לא נמצאו פריטים תואמים.',
      all: 'הכל',
      advanced: 'סינון מתקדם',
      priceRange: 'טווח מחיר',
      abvRange: 'אחוז אלכוהול',
      sellerRating: 'דירוג מוכר מינימלי',
      min: 'מ-',
      max: 'עד',
      stars: 'כוכבים',
      apply: 'החל סינון',
      sortBy: 'מיון לפי',
      sortOptions: {
        date_desc: 'הכי חדש',
        price_asc: 'מחיר: מהנמוך לגבוה',
        price_desc: 'מחיר: מהגבוה לנמוך',
        rating_desc: 'דירוג מוכר'
      },
      categories: {
        Wine: 'יין',
        Whiskey: 'וויסקי',
        Vodka: 'וודקה',
        Rum: 'רום',
        Gin: 'ג׳ין',
        Tequila: 'טקילה',
        Other: 'אחר'
      }
    },
    listing: {
      verified: 'מאומת',
      location: 'מיקום',
      price: 'מחיר',
      date: 'תאריך',
      currency: '$'
    },
    create: {
      title: 'העלאת מוצר למכירה',
      subtitle: 'ה-AI שלנו יאמת את התמונה שלך לאותנטיות.',
      uploadLabel: 'תמונת מוצר (חובה)',
      clickUpload: 'לחץ להעלאה או גרור ושחרר',
      uploadHint: 'תמונה ברורה של הבקבוק והתווית. PNG, JPG עד 10MB',
      remove: 'הסר והעלה אחרת',
      analyzing: 'Vertex AI מנתח את מבנה התמונה והתווית...',
      aiResult: 'תוצאת ניתוח AI',
      aiReview: 'נדרשת בדיקה: רמת ביטחון בינונית.',
      aiReject: 'נדחה: התמונה אינה תקינה.',
      aiVerify: 'מאומת: התאמה גבוהה.',
      loginRequired: 'עליך להתחבר כדי להעלות מוצר.',
      loginBtn: 'התחבר להמשך',
      form: {
        title: 'כותרת',
        desc: 'תיאור',
        price: 'מחיר (USD)',
        category: 'קטגוריה',
        abv: 'אלכוהול (%)',
        volume: 'נפח (מ"ל)',
        location: 'מיקום',
        submit: 'פרסם מוצר',
        brand: 'יקב / מותג',
        vintage: 'שנת בציר',
        kosher: 'כשר',
        isKosher: 'המוצר כשר',
      }
    },
    detail: {
      verifiedAuth: 'אותנטיות מאומתת',
      sellerInfo: 'פרטי מוכר',
      verifiedSeller: 'מוכר מאומת',
      whatsapp: 'שלח WhatsApp',
      call: 'התקשר למוכר',
      safety: 'תמיד יש להיפגש במקום ציבורי בטוח או לוודא את פרטי המשלוח בזהירות.',
      volume: 'נפח',
      abv: 'אלכוהול',
      brand: 'יקב / מותג',
      vintage: 'שנת בציר',
      kosher: 'כשר',
      // --- חדש: דירוג וצפיות ---
      viewCount: 'צפיות',
      reviews: 'ביקורות ודירוג',
      reviewFormTitle: 'דרג והשאר ביקורת למוכר',
      submitReview: 'שלח ביקורת',
      reviewPlaceholder: 'כתוב את הביקורת שלך כאן...',
      rateLabel: 'דרג את המוכר (1-5 כוכבים)',
      noReviews: 'טרם נכתבו ביקורות. היה הראשון לדרג את המוכר הזה!',
      reviewSuccess: 'הביקורת נשלחה בהצלחה!',
      reviewError: 'שליחת הביקורת נכשלה.',
      // -------------------------
    },
    // --- חדש: דפי ניהול ---
    account: {
        title: 'איזור אישי',
        subtitle: 'עדכן את הפרטים האישיים שלך ונהל את הפעילות באתר.',
        myDetails: 'הפרטים שלי',
        manageListings: 'ניהול המודעות שלי',
        wishlist: 'רשימת מועדפים',
        updateBtn: 'עדכן פרטים',
    },
    myListings: {
        title: 'המודעות שלי',
        subtitle: 'נהל, ערוך ומחק את הבקבוקים שפרסמת למכירה.',
        edit: 'ערוך',
        delete: 'מחק',
        confirmDeleteTitle: 'אישור מחיקה',
        confirmDeleteText: 'האם אתה בטוח שברצונך למחוק את המודעה הזו? פעולה זו אינה ניתנת לביטול.',
        deleteSuccess: 'המודעה נמחקה בהצלחה!',
        deleteError: 'מחיקת המודעה נכשלה.',
        noListings: "טרם פרסמת מודעות למכירה.",
    },
    editListing: {
        title: 'עריכת מודעה',
        updateBtn: 'עדכן מודעה',
        updateSuccess: 'המודעה עודכנה בהצלחה!',
        updateError: 'עדכון המודעה נכשל.',
    },
    // ---------------------
    admin: {
      title: 'לוח בקרה וניהול',
      subtitle: 'סקירה של תור האימות ובריאות המערכת.',
      systemOp: 'מערכת תקינה',
      statusOverview: 'סטטוס פריטים',
      humanLoop: 'פרוטוקול אנושי (Human-in-the-Loop)',
      humanLoopText: 'פריטים עם ציון אמינות AI בין 0.50 ל-0.75 מסומנים לבדיקה אנושית.',
      needsReview: 'נדרשת בדיקה',
      emptyQueue: 'הכל מעודכן! תור הניהול ריק.',
      approve: 'אשר',
      reject: 'דחה',
      aiAnalysis: 'ניתוח AI',
      seller: 'מוכר',
      price: 'מחיר',
      aiScore: 'ציון AI'
    },
    ageVerification: {
      title: 'אימות גיל',
      subtitle: 'הכניסה לאתר מותרת לגילאי 18 ומעלה בלבד.',
      confirm: 'אני מעל גיל 18',
      exit: 'יציאה',
      disclaimer: 'בכניסתך לאתר, אתה מסכים לתנאי השימוש ומדיניות הפרטיות שלנו.',
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he'); // Default to Hebrew

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const dir = language === 'he' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};