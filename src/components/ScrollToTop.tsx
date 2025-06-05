import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  const scrollToTop = useCallback(() => {
    // Try modern smooth scroll first
    try {
      // First try scrolling the document element
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      
      // Also scroll body for compatibility
      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    } catch (error) {
      // Ultimate fallback for older browsers
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    // Reset scroll position on route change
    scrollToTop();
    
    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, scrollToTop]);

  return null;
};

export default ScrollToTop; 