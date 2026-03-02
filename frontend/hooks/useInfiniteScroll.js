'use client';

import { useEffect, useRef } from 'react';

export function useInfiniteScroll(onLoadMore) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore?.();
      },
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onLoadMore]);

  return ref;
}
