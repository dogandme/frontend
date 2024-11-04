import { RefObject, useEffect, useState } from "react";

/**
 * 드롭다운 요소를 관리하는 커스텀 훅
 * 외부를 클릭하면 요소를 표시하지 않습니다.
 *
 * @param isOpen 요소 표시 여부
 * @param setIsOpen 요소 표시 여부를 변경하는 함수
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
  }, [ref]);

  return { isOpen, setIsOpen };
};
