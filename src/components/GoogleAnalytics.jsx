import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      const timer = setTimeout(() => {
        window.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: location.pathname + location.search,
          page_title: document.title
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
}
