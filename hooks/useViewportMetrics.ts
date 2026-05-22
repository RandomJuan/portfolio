import { useState, useEffect } from "react";

export function useViewportMetrics() {
  const [scaleFactor, setScaleFactor] = useState<number>(0.1);
  const [aspectRatio, setAspectRatio] = useState<number>(9 / 16);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      const ar = window.innerHeight / window.innerWidth;
      setAspectRatio(ar);

      const cardW = mobile ? 66 : 100;
      const innerW = cardW - 12; // exact margin horizontal offset
      setScaleFactor(innerW / window.innerWidth);
    };
    
    // Initial call
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { scaleFactor, aspectRatio, isMobile };
}
