
// Safely handle environment variables
// This supports both Vite build-time variables and Runtime injection (Docker/Cloud Run)

// Type definition for window with runtime config
declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

const getEnv = (): any => {
  const env: any = {};

  // 1. Try import.meta.env (Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      Object.assign(env, import.meta.env);
    }
  } catch (e) {
    // Ignore errors if import.meta is not supported
  }

  // 2. Try window._env_ (Runtime injection for Docker/Cloud Run)
  if (typeof window !== 'undefined' && window._env_) {
    Object.assign(env, window._env_);
  }

  return env;
};

const env = getEnv();

export const config = {
  // Default to FALSE (Real API) to ensure data is saved to DB.
  // Set VITE_USE_MOCK='true' explicitly if you want to use the mock service.
  useMock: env.VITE_USE_MOCK === 'true', 
  // API URL: Use relative path by default to leverage Vite Proxy or Same-Origin in prod
  apiUrl: env.VITE_API_URL || '/api',
};
