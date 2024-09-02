import { ReactNode, useEffect } from "react";
import { useBottomSheetMoving } from "./bottomSheet.hook";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  children: ReactNode;
  minY: number;
  maxY?: number;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const HEADER_HEIGHT = 36;

const BottomSheet = ({
  isOpen,
  onOpen,
  onClose,
  children,
  minY,
  maxY = window.innerHeight - HEADER_HEIGHT,
}: BottomSheetProps) => {
  const BOTTOM_SHEET_HEIGHT = window.innerHeight - minY;

  if (typeof isOpen === "boolean" && !(onOpen && onClose)) {
    throw new Error("isOpen 상태가 있다면, onOpen과 onClose를 설정해주세요.");
  }

  const { sheet, content } = useBottomSheetMoving({
    minY,
    maxY,
    onClose,
    onOpen,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return createPortal(
    <div
      ref={sheet}
      className="shadow-bottom-sheet z-bottom-sheet fixed left-0 right-0 mx-auto flex w-full min-w-80 max-w-[37.5rem] flex-col rounded-t-[1.75rem] bg-grey-0 transition-transform ease-in-out"
      style={{
        top: `${maxY}px`,
        height: `${BOTTOM_SHEET_HEIGHT}px`,
        transform: `translateY(${isOpen ? minY - maxY : 0}px)`,
      }}
    >
      {/* header */}
      <div className="flex flex-col items-center gap-3 rounded-t-[1.75rem] p-4">
        <div className="h-1 w-8 rounded-[6.25rem] bg-grey-500"></div>
      </div>

      {/* body */}
      <div
        ref={content}
        className="h-fit overflow-auto p-4"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
    </div>,
    document.querySelector("#bottom-sheet") as HTMLElement,
  );
};

export default BottomSheet;
