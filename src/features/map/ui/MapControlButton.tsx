import { useMap } from "@vis.gl/react-google-maps";
import { CurrentLocationLoading } from "@/entities/map/ui";
import { MapSnackbar } from "@/entities/map/ui/MapSnackbar";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import {
  BookmarkIcon,
  DogFootIcon,
  ExitIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { MarkingFormModal } from "../../marking/ui";
import { useCurrentLocation } from "../lib";
import { useMapStore } from "../store";

/* ----------default mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingAddButton = () => {
  const setMode = useMapStore((state) => state.setMode);

  const { handleOpen, onClose } = useSnackBar(() => (
    <MapSnackbar onClose={onClose} autoHideDuration={5000}>
      마킹 위치를 손가락으로 움직여서 선택해 주세요
    </MapSnackbar>
  ));

  const handleClick = () => {
    handleOpen();
    setMode("add");
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
      <img src="/public/default-image.png" className="w-7 h-7 rounded-full" />
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
  const { handleOpen, onClose: onCloseMarkingModal } = useModal(() => (
    <MarkingFormModal onCloseMarkingModal={onCloseMarkingModal} />
  ));

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleOpen}
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
