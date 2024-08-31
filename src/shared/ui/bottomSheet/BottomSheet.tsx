import { ReactNode } from "react";
import { useBottomSheetMoving } from "./bottomSheet.hook";

interface BottomSheetProps {
  children: ReactNode;
  minY: number;
  maxY?: number;
}

const HEADER_HEIGHT = 36;

const BottomSheet = ({
  children,
  minY,
  maxY = window.innerHeight - HEADER_HEIGHT,
}: BottomSheetProps) => {
  const BOTTOM_SHEET_HEIGHT = window.innerHeight - minY;

  const { sheet, content } = useBottomSheetMoving({ minY, maxY });

  return (
    <div
      ref={sheet}
      className={`shadow-bottom-sheet absolute left-0 right-0 z-10 flex flex-col rounded-t-[1.75rem] bg-grey-0 transition-transform ease-in-out`}
      style={{
        top: `${maxY}px`,
        height: `${BOTTOM_SHEET_HEIGHT}px`,
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
    </div>
  );
};

export default BottomSheet;
