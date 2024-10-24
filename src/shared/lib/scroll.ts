import { useEffect, useRef, useState } from "react";

/**
 * 해당 훅은 setNode를 반환하며, setNode는 Element를 받아 IntersectionObserver를 생성합니다.
 * IntersectionObserver는 해당 setNode가 장착 된 Element가 화면에 보일 때 callback을 실행합니다.
 */
export const useInfiniteScroll = (callbackFn: () => void) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbackFn();
        }
      });
    });

    if (node) {
      observer.current.observe(node);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [node, callbackFn]);

  return [setNode] as const;
};
