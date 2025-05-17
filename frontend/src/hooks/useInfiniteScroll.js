// useInfiniteScroll.js
import { useEffect, useRef, useCallback } from 'react';

export default function useInfiniteScroll(loadMore, hasMore, containerRef) {
  const observerRef = useRef();

  const handleIntersect = useCallback(entries => {
    if (entries[0].isIntersecting && hasMore) {
      loadMore();
    }
  }, [loadMore, hasMore]);

  useEffect(() => {
    if (!containerRef.current) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: containerRef.current,
      threshold: 0
    });
    const sentinel = containerRef.current.querySelector('#top-sentinel');
    if (sentinel) observerRef.current.observe(sentinel);
    return () => observerRef.current.disconnect();
  }, [handleIntersect, containerRef]);
}
