import { useEffect, useRef } from "react";

/**
 * Hook for initializing and managing Locomotive Scroll
 */
export function useLocomotiveScroll() {
  const locomotiveScrollRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      locomotiveScrollRef.current = new LocomotiveScroll();

      return () => {
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.destroy();
        }
      };
    })();
  }, []);

  return locomotiveScrollRef;
} 