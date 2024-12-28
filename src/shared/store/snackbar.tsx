import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SNACKBAR_ID,
  SNACKBAR_ANIMATION_DURATION,
  SNACKBAR_AUTO_HIDE_DURATION,
} from "../constants";
import { type SnackbarProps, Snackbar } from "../ui/snackbar";
import { useOverlayStore } from "./overlay";

type HandleOpenSnackbar = (
  content: SnackbarProps["children"],
  type: SnackbarProps["type"],
) => void;
interface SnackbarSlide {
  slide: "slideDown" | "slideUp";
}

const SnackbarContext = createContext<HandleOpenSnackbar>(() => {});

interface SnackbarControllerProps {
  children: React.ReactNode;
}

export const SnackbarController = ({ children }: SnackbarControllerProps) => {
  // 스낵바 내부에서 렌더링 될 children을 제어하기 위한 상태
  const [snackbarChildren, setSnackbarChildren] =
    useState<SnackbarProps["children"]>(null);
  // 스낵바의 열림, 닫힘 애니메이션을 위한 상태
  const [snackbarSlide, setSnackbarSlide] = useState<SnackbarSlide>({
    slide: "slideDown",
  });
  // 스낵바의 타입을 제어하기 위한 상태
  const [type, setType] = useState<SnackbarProps["type"]>("default");

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
  // OverlayPortal을 통해 마운트 된 스낵바를 가리키기 위한 ref
  const snackbarRef = useRef<HTMLDivElement | null>(null);

  const handleOpenSnackbar = useCallback(
    (content: SnackbarProps["children"], type: SnackbarProps["type"]) => {
      removeOverlay(SNACKBAR_ID);
      setSnackbarSlide({ slide: "slideDown" });
      setSnackbarChildren(content);
      setType(type);
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
          <Snackbar
            type={type}
            onClose={() => setSnackbarSlide({ slide: "slideUp" })}
            ref={snackbarRef}
          >
            {snackbarChildren}
          </Snackbar>
        ),
        options: {
          disableInteraction: false,
        },
      });

      if (snackbarSlideTimerRef.current) {
        clearTimeout(snackbarSlideTimerRef.current);
      }
      if (snackbarCloseTimerRef.current) {
        clearTimeout(snackbarCloseTimerRef.current);
      }

      snackbarSlideTimerRef.current = setTimeout(() => {
        setSnackbarSlide({ slide: "slideUp" });
      }, SNACKBAR_AUTO_HIDE_DURATION - SNACKBAR_ANIMATION_DURATION);

      snackbarCloseTimerRef.current = setTimeout(() => {
        removeOverlay(SNACKBAR_ID);
      }, SNACKBAR_AUTO_HIDE_DURATION);

      return;
    }

    // snackbarSlide가 slideUp인 경우 기존 타이머를 제거하고 애니메이션 시행 후 스낵바가 언마운트 되도록 합니다.
    // snackbarSlide가 slideUp이 되는 경우는 snackbarSlideTimer 가 실행 되어 자동으로 닫히거나
    // 직접 사용자가 스낵바의 closeIcon을 클릭하여 닫히는 경우입니다.

    if (!snackbarRef.current) {
      return;
    }

    if (snackbarSlideTimerRef.current) {
      clearTimeout(snackbarSlideTimerRef.current);
    }
    if (snackbarCloseTimerRef.current) {
      clearTimeout(snackbarCloseTimerRef.current);
    }

    snackbarRef.current.classList.add(`snackbar-slideUp-${type}`);

    snackbarCloseTimerRef.current = setTimeout(() => {
      removeOverlay(SNACKBAR_ID);
    }, SNACKBAR_ANIMATION_DURATION);
  }, [snackbarChildren, addOverlay, snackbarSlide, type, removeOverlay]);

  return (
    <SnackbarContext.Provider value={handleOpenSnackbar}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (type: SnackbarProps["type"]) => {
  const handleOpenSnackbar = useContext(SnackbarContext)!;

  return useCallback(
    (content: SnackbarProps["children"]) => handleOpenSnackbar(content, type),
    [handleOpenSnackbar, type],
  );
};
