import { createContext, useContext } from "react";
import type { MarkingItemProps } from "../ui";

/**
 * 해당 컨텍스트는 MarkingItem 컴포넌트의 props drilling 문제를 해결하기 위해 생성되었습니다.
 */
export interface MarkingItemProviderValue extends MarkingItemProps {
  isFollowing: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
}

export const MarkingItemContext =
  createContext<MarkingItemProviderValue | null>(null);
export const useMarkingItemProps = () => {
  const props = useContext(MarkingItemContext);
  if (!props) {
    throw new Error(
      "마킹 아이템 컨텍스트는 마킹 아이템 프로바이더 내부에서만 사용 가능 합니다",
    );
  }
  return props;
};
