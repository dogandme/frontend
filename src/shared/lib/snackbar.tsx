import { useCallback, useEffect, useRef, useState } from "react";
import { useOverlayStore } from "../store";
import { type _SnackbarProps, _Snackbar } from "../ui/snackbar";

type SnackbarSlide = Pick<_SnackbarProps, "slide">;

export const useSnackbar = (type: _SnackbarProps["type"]) => {
  // 스낵바 내부에서 렌더링 될 children을 제어하기 위한 상태
  const [snackbarChildren, setSnackbarChildren] =
    useState<_SnackbarProps["children"]>(null);

  // 스낵바의 열림, 닫힘 애니메이션을 위한 상태
  const [snackbarSlide, setSnackbarSlide] = useState<SnackbarSlide>({
    slide: "slideDown",
  });

  // 스낵바의 마운트, 언마운트를 제어하기 위한 OverlayStore의 메소드
  const addOverlay = useOverlayStore((state) => state.addOverlay);
  const removeOverlay = useOverlayStore((state) => state.removeOverlay);

  // 스낵바의 슬라이드 클래스명 변경을 제어하기 위한 타이머 ref
  const snackbarSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // 스낵바의 닫힘을 제어하기 위한 타이머 ref
  const snackbarCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 스낵바의 고유 ID
  const SNACKBAR_ID = 999999999;
  // 스낵바가 마운트 후 자동으로 언마운트 되기 까지 걸리는 시간
  const AUTO_HIDE_DURATION = 2000;
  // 스낵바의 slide keyframe 애니메이션 작동 시간
  const ANIMATION_DURATION = 500;

  const handleOpenSnackbar = useCallback(
    (content: _SnackbarProps["children"]) => {
      removeOverlay(SNACKBAR_ID);
      setSnackbarSlide({ slide: "slideDown" });
      setSnackbarChildren(content);
    },
    [removeOverlay],
  );

  useEffect(() => {
    if (snackbarChildren === null) return;

    // snackbarSlide가 slideDown인 경우 스낵바를 마운트하고 일정 시간 후 slideUp으로 변경합니다.
    // 이러한 과정을 통해 스낵바는 slideDown -> slideUp -> 언마운트 순으로 애니메이션 됩니다.

    const { slide } = snackbarSlide;
    if (slide === "slideDown") {
      addOverlay({
        id: SNACKBAR_ID,
        component: (
          <_Snackbar
            type={type}
            slide={slide}
            onClose={() => setSnackbarSlide({ slide: "slideUp" })}
          >
            {snackbarChildren}
          </_Snackbar>
        ),
        options: {
          disableInteraction: false,
        },
      });

      snackbarSlideTimerRef.current = setTimeout(() => {
        setSnackbarSlide({ slide: "slideUp" });
      }, AUTO_HIDE_DURATION - ANIMATION_DURATION);

      snackbarCloseTimerRef.current = setTimeout(() => {
        removeOverlay(SNACKBAR_ID);
      }, AUTO_HIDE_DURATION);
      return;
    }

    // snackbarSlide가 slideUp인 경우 기존 타이머를 제거하고 애니메이션 시행 후 스낵바가 언마운트 되도록 합니다.
    // snackbarSlide가 slideUp이 되는 경우는 snackbarSlideTimer 가 실행 되어 자동으로 닫히거나
    // 직접 사용자가 스낵바의 closeIcon을 클릭하여 닫히는 경우입니다.

    clearTimeout(snackbarSlideTimerRef.current!);
    clearTimeout(snackbarCloseTimerRef.current!);

    snackbarCloseTimerRef.current = setTimeout(() => {
      removeOverlay(SNACKBAR_ID);
    }, ANIMATION_DURATION);
  }, [snackbarChildren, addOverlay, snackbarSlide, type, removeOverlay]);

  return handleOpenSnackbar;
};
