import { retrieveRawInitData } from '@telegram-apps/sdk-react';

/**
 * Get the raw init data string from Telegram SDK
 * @returns Raw init data string or null if not available
 */
export function getTelegramInitData(): string | null {
  try {
    // Get the raw init data using the new SDK method
    const rawInitData = retrieveRawInitData();
    
    if (rawInitData) {
      return rawInitData;
    }
    
    // Fallback: try to get from URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      if (tgWebAppData) {
        return decodeURIComponent(tgWebAppData);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get Telegram init data:', error);
    return null;
  }
}

/**
 * Create authenticated fetch function that includes Telegram init data
 * @returns Fetch function with authentication headers
 */
export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const initDataString = getTelegramInitData();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    
    // Add init data to headers if available
    if (initDataString) {
      headers['X-Telegram-Init-Data'] = initDataString;
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  };
}

/**
 * Send authenticated request with init data validation
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Response with error handling
 */
export async function authenticatedRequest(
  url: string,
  options: RequestInit = {}
) {
  try {
    const authFetch = createAuthenticatedFetch();
    const response = await authFetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Request failed',
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      
      throw new Error(errorData.message || 'Request failed');
    }
    
    return response;
  } catch (error: any) {
    console.error('Authenticated request failed:', error);
    throw error;
  }
}

/**
 * Check if the current environment has valid Telegram init data
 * @returns Boolean indicating if init data is available
 */
export function hasTelegramInitData(): boolean {
  const initDataString = getTelegramInitData();
  return !!initDataString && initDataString.length > 0;
}