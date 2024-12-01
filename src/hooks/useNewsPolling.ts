import { useEffect, useRef, useCallback } from 'react';
import { useNewsStore } from '../store/useNewsStore';

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useNewsPolling() {
  const fetchArticles = useNewsStore(state => state.fetchArticles);
  const pollingRef = useRef<number>();

  const poll = useCallback(() => {
    fetchArticles().catch(error => {
      console.error('Polling error:', error);
    });
  }, [fetchArticles]);

  useEffect(() => {
    // Initial fetch
    poll();

    // Set up polling using window.setInterval instead of NodeJS.Timeout
    pollingRef.current = window.setInterval(poll, POLLING_INTERVAL);

    // Cleanup
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, [poll]);
}