import { useMap } from "@vis.gl/react-google-maps";
import { CurrentLocationLoading } from "@/entities/map/ui";
import { useModal, useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import {
  BookmarkIcon,
  DogFootIcon,
  ExitIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { MarkingFormModal } from "../../marking/ui";
import { useCurrentLocation } from "../hooks";
import { useMapStore } from "../store";

/* ----------default mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingAddButton = () => {
  const setMode = useMapStore((state) => state.setMode);

  const handleOpenSnackbar = useSnackBar();

  const handleClick = () => {
    setMode("add");
    // MarkingAddButton 은 핸들 클릭 발생 시 언마운트 됩니다.
    // 언마운트로 인해 해당 스낵바의 타이머가 제거 되는 것을 방지하기 위해
    // 모드 변경 후 비동기적으로 스낵바를 띄웁니다.
    setTimeout(
      () =>
        handleOpenSnackbar("마킹 위치를 손가락으로 움직여서 선택해 주세요", {
          type: "map",
        }),
      0,
    );
  };

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleClick}
    >
      <span className="btn-3">마킹하기</span>
    </Button>
  );
};

export const MyLocationButton = () => {
  const map = useMap();

  const isCenteredOnMyLocation = useMapStore(
    (state) => state.isCenterOnMyLocation,
  );
  const setIsMapCenteredOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );

  const { loading, setCurrentLocation } = useCurrentLocation();

  const handleClick = () => {
    setCurrentLocation({
      onSuccess: ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;

        map.setCenter({ lat, lng });
        setTimeout(() => {
          setIsMapCenteredOnMyLocation(true);
        }, 0);
      },
    });
  };

  return (
    <>
      {loading && <CurrentLocationLoading />}
      <Button
        type="button"
        variant="outlined"
        colorType={isCenteredOnMyLocation ? "primary" : "tertiary"}
        size="medium"
        className="shadow-custom-1 border-none"
        aria-label="내 마킹만 보기"
        onClick={handleClick}
      >
        <MyLocationIcon />
      </Button>
    </>
  );
};

const buttonBaseStyles = "border-none outline-none h-14 px-[.875rem]";

export const ShowMyMarkingButton = () => {
  // todo 상태 전역으로 관리하기
  const shouldShowMyMarking = false;

  return (
    <Button
      type="button"
      variant={shouldShowMyMarking ? "filled" : "outlined"}
      colorType={shouldShowMyMarking ? "primary" : "tertiary"}
      size="medium"
      className={`${buttonBaseStyles} rounded-b-none`}
      aria-label="내 마킹만 보기"
      onClick={() => {
        // todo 내 마킹 보기로 상태 변경
      }}
    >
      <img src="/default-image.png" className="w-7 h-7 rounded-full" />
    </Button>
  );
};

export const ShowAroundMarkingButton = () => {
  // todo 상태 전역으로 관리하기
  const shouldShowAroundMarking = false;

  return (
    <Button
      type="button"
      variant={shouldShowAroundMarking ? "filled" : "outlined"}
      colorType={shouldShowAroundMarking ? "primary" : "tertiary"}
      size="medium"
      className={`${buttonBaseStyles} rounded-t-none`}
      aria-label="주변 마킹 보기"
      onClick={() => {
        // todo 주변 마킹 보기로 상태 변경
      }}
    >
      <DogFootIcon />
    </Button>
  );
};

export const CollectionButton = () => {
  // todo 상태 전역으로 관리하기
  const isCollectionActive = false;

  return (
    <Button
      type="button"
      variant="outlined"
      colorType={isCollectionActive ? "primary" : "tertiary"}
      size="medium"
      className="shadow-custom-1 border-none"
      aria-label="좋아요를 눌렀거나 저장한 마킹들 나타내기"
      onClick={() => {
        // todo 좋아요 / 저장됨 마킹 보기로 상태 변경
      }}
    >
      <BookmarkIcon />
    </Button>
  );
};

/* ----------add mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingFormTriggerButton = () => {
  const handleOpenSnackbar = useSnackBar();
  const { handleOpen, onClose: onCloseMarkingModal } = useModal(() => (
    <MarkingFormModal onCloseMarkingModal={onCloseMarkingModal} />
  ));

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={() => {
        if (!useAuthStore.getState().token) {
          handleOpenSnackbar("로그인 후 이용해 주세요");
          return;
        }
        handleOpen();
      }}
    >
      <span className="btn-3">여기에 마킹하기</span>
    </Button>
  );
};

export const ExitAddModeButton = () => {
  const setMode = useMapStore((state) => state.setMode);
  const handleClick = () => {
    setMode("view");
  };

  return (
    <Button
      type="button"
      variant="outlined"
      colorType="tertiary"
      size="medium"
      className="shadow-custom-1 border-none"
      aria-label="마커 추가 모드 종료하기"
      onClick={handleClick}
    >
      <ExitIcon />
    </Button>
  );
};
