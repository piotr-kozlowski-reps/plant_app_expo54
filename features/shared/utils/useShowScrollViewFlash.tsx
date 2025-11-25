import { useEffect, useRef } from "react";
import { ScrollViewRef } from "../types/interfaces_scroolview";

export const useShowScrollViewFlash = () => {
  const scrollViewRef = useRef<ScrollViewRef | null>(null);
  useEffect(() => {
    setTimeout(function () {
      scrollViewRef.current?.flashScrollIndicators();
    }, 500);
  }, []);

  return { scrollViewRef };
};
