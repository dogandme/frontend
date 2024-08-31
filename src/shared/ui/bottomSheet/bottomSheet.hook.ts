import { useEffect, useRef } from "react";

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number; // 바텀시트의 최상단 모서리의 높이 Y값
    touchY: number; // 터치 시작 지점의 Y값
  };
  touchMove: {
    prevTouchY?: number; // 이전 터치 지점의 Y값
    movingDirection: "none" | "down" | "up"; // 터치 이동 방향
  };
  isContentAreaTouched: boolean;
}

export function useBottomSheetMoving({
  minY,
  maxY,
}: {
  minY: number;
  maxY: number;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;

      if (!isContentAreaTouched) {
        return true;
      }

      if (sheetRef.current!.getBoundingClientRect().y !== minY) {
        return true;
      }

      if (touchMove.movingDirection === "down") {
        return contentRef.current!.scrollTop <= 0;
      }
      return false;
    };

    // * bottom sheet를 터치했을 때 실행
    const handleTouchStart = (e: TouchEvent) => {
      const { touchStart } = metrics.current;

      touchStart.sheetY = sheetRef.current!.getBoundingClientRect().y;
      touchStart.touchY = e.touches[0].clientY;
    };

    // * 터치한 상태에서 이동할 때 실행
    const handleTouchMove = (e: TouchEvent) => {
      const { touchStart, touchMove } = metrics.current;

      // e.touches는 현재 화면에 터치된 모든 지점들의 정보
      const currentTouch = e.touches[0];

      // 이전 터치 지점 정보가 없을 경우, 현재 터치 지점으로 초기화
      if (touchMove.prevTouchY === undefined || touchMove.prevTouchY === 0) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      // 이전 터치 지점과 현재 터치 지점의 y값을 비교하여 이동 방향 파악
      if (touchMove.prevTouchY < currentTouch.clientY) {
        touchMove.movingDirection = "down";
      }
      if (touchMove.prevTouchY > currentTouch.clientY) {
        touchMove.movingDirection = "up";
      }

      if (!canUserMoveBottomSheet()) return;

      const touchOffset = currentTouch.clientY - touchStart.touchY;
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
      ); //바닥 만큼은 빼야한다
    };

    // * 터치가 끝났을 때 bottom sheet 이동 및 위치 정보 초기화
    const handleTouchEnd = () => {
      const { touchMove } = metrics.current;

      const currentSheetY = sheetRef.current!.getBoundingClientRect().y;

      if (currentSheetY !== minY) {
        // 아래 방향으로 터치했을 때, 바텀 시트가 최대로 내려간다.
        if (touchMove.movingDirection === "down") {
          sheetRef.current!.style.setProperty("transform", "translateY(0)");
        }

        // 위로 터치했을 때, 바텀 시트가 최대로 올라간다.
        if (touchMove.movingDirection === "up") {
          sheetRef.current!.style.setProperty(
            "transform",
            `translateY(${minY - maxY}px)`,
          );
        }
      }

      // metrics 초기화.
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

    sheetRef.current?.addEventListener("touchstart", handleTouchStart);
    sheetRef.current?.addEventListener("touchmove", handleTouchMove);
    sheetRef.current?.addEventListener("touchend", handleTouchEnd);

    return () => {
      sheetRef.current?.removeEventListener("touchstart", handleTouchStart);
      sheetRef.current?.removeEventListener("touchmove", handleTouchMove);
      sheetRef.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [minY, maxY]);

  // content 영역 터치 기록
  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };

    contentRef.current?.addEventListener("touchstart", handleTouchStart);

    return () => {
      contentRef.current?.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return { sheet: sheetRef, content: contentRef };
}
