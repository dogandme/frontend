import { RefObject, useEffect, useRef, useState } from "react";

/**
 * 요소 외부를 클릭했을 때 실행할 함수를 등록하는 Hook
 *
 * @param ref ref가 참조하는 요소 외부를 클릭했을 때 onOutsideClick 실행
 * @param onOutsideClick 외부를 클릭했을 때 실행할 함수
 */

export const useDropdown = (ref: RefObject<HTMLElement>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, onOutsideClick]);

  return { isOpen, setIsOpen };
};
