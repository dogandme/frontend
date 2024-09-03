import { useEffect, useRef } from "react";

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number; // 바텀시트의 최상단 모서리의 높이 Y값
    touchY: number; // 터치 시작 지점의 Y값
  };
  touchMove: {
    prevTouchY: number; // 이전 터치 지점의 Y값
    movingDirection: "none" | "down" | "up"; // 터치 이동 방향
  };
  isContentAreaTouched: boolean;
}

export const useBottomSheetMoving = ({
  sheetRef,
  contentRef,
  minY,
  maxY,
  midY,
  onOpen,
  onClose,
}: {
  sheetRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  minY: number;
  maxY: number;
  midY?: number;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const metrics = useRef<BottomSheetMetrics>({
    touchStart: {
      sheetY: 0, // 터치 시작 지점의 bottom sheet가 위치한 y값
      touchY: 0, // 터치 시작 지점의 y값
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: "none",
    },
    isContentAreaTouched: false, // 현재 터치된 지점이 content인지 여부
  });

  // 마우스 드래그 여부
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;

      if (!isContentAreaTouched) return true;

      if (touchMove.movingDirection === "down") {
        return contentRef.current!.scrollTop <= 0;
      }

      return false;
    };

    const handleStart = (clientY: number) => {
      const { touchStart } = metrics.current;

      touchStart.sheetY = sheetRef.current!.getBoundingClientRect().y;
      touchStart.touchY = clientY;
    };

    const handleMove = (clientY: number) => {
      const { touchStart, touchMove } = metrics.current;

      const currentTouchY = clientY;

      if (touchMove.prevTouchY === 0) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      if (touchMove.prevTouchY < currentTouchY) {
        touchMove.movingDirection = "down";
      }
      if (touchMove.prevTouchY > currentTouchY) {
        touchMove.movingDirection = "up";
      }

      if (!canUserMoveBottomSheet()) return;

      const touchOffset = currentTouchY - touchStart.touchY;
      let nextSheetY = touchStart.sheetY + touchOffset;

      if (nextSheetY <= minY) {
        nextSheetY = minY;
      }

      if (nextSheetY >= maxY) {
        nextSheetY = maxY;
      }

      sheetRef.current!.style.setProperty(
        "transform",
        `translateY(${nextSheetY - maxY}px)`,
      );
    };

    const initMetrics = () => {
      metrics.current = {
        touchStart: {
          sheetY: 0,
          touchY: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: "none",
        },
        isContentAreaTouched: false,
      };
    };

    const handleEndWithMidY = (midY: number) => {
      if (!canUserMoveBottomSheet()) {
        initMetrics();
        return;
      }

      const { touchMove } = metrics.current;
      const { movingDirection } = touchMove;
      const currentY = sheetRef.current!.getBoundingClientRect().y;

      // 바텀 시트가 상단 ~ 중단 사이에 위치하는지
      const isBetweenMinAndMid = currentY < midY && currentY > minY;

      if (movingDirection === "down") {
        if (isBetweenMinAndMid) {
          // 바텀 시트 중간에 위치
          sheetRef.current!.style.setProperty(
            "transform",
            `translateY(${midY - maxY}px)`,
          );
        } else {
          // 바텀 시트 맨 아래에 위치
          sheetRef.current!.style.setProperty("transform", `translateY(0)`);
          onClose?.();
        }
      }

      // 바텀 시트 중단 ~ 하단 사이에 위치하는지
      const isBetweenMidAndMax = currentY < maxY && currentY > midY;

      if (movingDirection === "up") {
        if (isBetweenMidAndMax) {
          sheetRef.current!.style.setProperty(
            "transform",
            `translateY(${minY - maxY}px)`,
          );
        } else {
          sheetRef.current!.style.setProperty(
            "transform",
            `translateY(${midY - maxY}px)`,
          );
          onOpen?.();
        }
      }

      initMetrics();
    };

    const handleEnd = () => {
      if (!canUserMoveBottomSheet()) {
        initMetrics();
        return;
      }

      const { touchMove } = metrics.current;

      if (touchMove.movingDirection === "down") {
        sheetRef.current!.style.setProperty("transform", "translateY(0)");
        onClose?.();
      }

      if (touchMove.movingDirection === "up") {
        sheetRef.current!.style.setProperty(
          "transform",
          `translateY(${minY - maxY}px)`,
        );
        onOpen?.();
      }

      initMetrics();
    };

    // * 첫 터치 시작했을 때 실행
    const handleTouchStart = (e: TouchEvent) =>
      handleStart(e.touches[0].clientY);

    // * 터치한 상태에서 이동할 때 실행
    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientY);
    };

    // * 터치가 끝났을 때 bottom sheet 이동 및 위치 정보 초기화
    const handleTouchEnd = () => {
      if (typeof midY === "number") handleEndWithMidY(midY);
      else handleEnd();
    };

    sheetRef.current?.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    sheetRef.current?.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    sheetRef.current?.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    // * 마우스를 처음 눌렀을 때 실행
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;

      handleStart(e.clientY);

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;

        handleMove(e.clientY);
      };

      sheetRef.current?.addEventListener("mousemove", handleMouseMove);

      const handleMouseUp = () => {
        isDragging.current = false;

        if (typeof midY === "number") handleEndWithMidY(midY);
        else handleEnd();

        sheetRef.current?.removeEventListener("mousemove", handleMouseMove);
      };

      // * once: true 옵션은 리스너가 한 번만 실행되고 자동으로 제거됨
      sheetRef.current?.addEventListener("mouseup", handleMouseUp, {
        once: true,
      });
    };

    sheetRef.current?.addEventListener("mousedown", handleMouseDown);

    return () => {
      sheetRef.current?.removeEventListener("touchstart", handleTouchStart);
      sheetRef.current?.removeEventListener("touchmove", handleTouchMove);
      sheetRef.current?.removeEventListener("touchend", handleTouchEnd);

      sheetRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [minY, maxY, onClose, onOpen, midY]);

  // content 영역 터치 기록
  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };
    const handleMouseDown = () => {
      metrics.current.isContentAreaTouched = true;
      isDragging.current = true;
    };

    contentRef.current?.addEventListener("touchstart", handleTouchStart);
    contentRef.current?.addEventListener("mousedown", handleMouseDown);

    return () => {
      contentRef.current?.removeEventListener("touchstart", handleTouchStart);
      contentRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
};
