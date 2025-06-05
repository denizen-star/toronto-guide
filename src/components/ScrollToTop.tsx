import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  const scrollToTop = useCallback(() => {
    try {
      // Use smooth scrolling for better UX
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Fallback for document and body
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    // Only scroll to top on route change, with a small delay to ensure content is ready
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, scrollToTop]);

  return null;
};

export default ScrollToTop; 