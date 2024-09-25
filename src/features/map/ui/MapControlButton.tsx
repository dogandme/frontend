import { useMap } from "@vis.gl/react-google-maps";
import { CurrentLocationLoading, FloatingButton } from "@/entities/map/ui";
import { MapSnackbar } from "@/entities/map/ui/MapSnackbar";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import {
  ExitIcon,
  LocationIcon,
  MyLocationIcon,
  StarIcon,
} from "@/shared/ui/icon";
import { useCurrentLocation } from "../lib";
import { useMapStore } from "../store";
import { MarkingFormModal } from "./MarkingFormModal";

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
      <FloatingButton
        aria-label="지도의 중심을 현재 위치로 이동 시키기"
        onClick={handleClick}
        controlledIsActive={isCenteredOnMyLocation}
      >
        <MyLocationIcon />
      </FloatingButton>
    </>
  );
};

export const ShowOthersMarkingButton = () => {
  return (
    <FloatingButton aria-label="현재 보고 있는 지도의 마킹을 나타내기">
      <LocationIcon />
    </FloatingButton>
  );
};

export const CollectionButton = () => {
  return (
    <FloatingButton aria-label="좋아요 버튼을 눌렀거나 저장한 마킹들 나타내기">
      <StarIcon />
    </FloatingButton>
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
    <FloatingButton onClick={handleClick} aria-label="마커 추가 모드 종료하기">
      <ExitIcon />
    </FloatingButton>
  );
};
