// Utility to force clear NextAuth session cache
export const clearSessionCache = () => {
  // Clear NextAuth client-side cache
  if (typeof window !== 'undefined') {
    // Clear session storage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('next-auth.') || key.includes('session')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear local storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('next-auth.') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear any potential memory cache by dispatching a storage event
    window.dispatchEvent(new Event('storage'));
  }
};

export const forceSessionRefresh = async () => {
  clearSessionCache();
  
  // Force a navigation event to trigger session revalidation
  if (typeof window !== 'undefined') {
    const url = new URL(window.location);
    window.history.replaceState({}, '', url);
    
    // Trigger a focus event to force session check
    window.dispatchEvent(new Event('focus'));
  }
};
