import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useOverlayStore } from "@/shared/store/overlay";
import type { OverlayInfo } from "@/shared/store/overlay";

/**
 * OverlayController 컴포넌트는 overlayInfo 에 담긴 정보에 따라 다르게 행동합니다.
 * 만약 overlay.options.disabledInteraction 이 true 일 경우엔 외부 클릭을 막습니다.
 */
const OverlayWrapper = ({ overlayInfo }: { overlayInfo: OverlayInfo }) => {
  const { component, onClose, options } = overlayInfo;
  const { disableInteraction } = options;

  // 기본적으로 발생한 Overlay가 아닌 영역을 클릭하면 Overlay를 닫습니다.
  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
  // 만약 disabledInteraction 이 false인 경우 (Overlay와 함께 인터렉션을 할 경우)에는
  // OverlayController 영역을 최소화 합니다.
  const overlayAreaClass = disableInteraction
    ? "h-screen w-screen bg-translucent-gray"
    : "w-screen h-fit";

  return (
    <div
      onClick={handleWrapperClick}
      className={`absolute ${overlayAreaClass}`}
    >
      {component}
    </div>
  );
};

/**
 * OverlayPortal 컴포넌트는 오버레이를 렌더링합니다.
 * overlay들이 렌더링 되는 영역은 뷰포트 크기를 가진 div 입니다.
 * 따라서 overlay들은 뷰포트를 기준으로 하여 top, left, right, bottom 값으로 위치를 조정합니다.
 *
 * 오버레이가 열린 채로 라우팅이 일어나면 모든 오버레이를 제거 합니다.
 */
export const OverlayPortal = () => {
  const { pathname, search } = useLocation();
  const overlays = useOverlayStore((state) => state.overlays);
  const resetOverlays = useOverlayStore((state) => state.resetOverlays);

  const shouldDisableInteraction = overlays.some(
    ({ options: { disableInteraction } }) => disableInteraction === true,
  );

  // 떠있는 overlay 중 하나라도 interaction을 막아야 하는 경우에는 body의 스크롤을 막습니다.
  useEffect(() => {
    if (shouldDisableInteraction) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [shouldDisableInteraction]);

  // 페이지 이동 시 모든 오버레이를 제거합니다.
  useEffect(() => {
    resetOverlays();
  }, [pathname, search, resetOverlays]);

  const overlayAreaBackground = shouldDisableInteraction ? "h-screen" : "";

  if (overlays.length === 0) return null;
  return createPortal(
    <div
      className={`fixed left-0 top-0 z-[1000] w-screen ${overlayAreaBackground}`}
    >
      {overlays.map((overlayInfo) => (
        <OverlayWrapper key={overlayInfo.id} overlayInfo={overlayInfo} />
      ))}
    </div>,
    document.querySelector("#root")!,
  );
};
