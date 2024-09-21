import { useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { FloatingButton } from "@/entities/map/ui";
import { MapSnackbar } from "@/entities/map/ui/MapSnackbar";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import {
  ExitIcon,
  LocationIcon,
  MyLocationIcon,
  StarIcon,
} from "@/shared/ui/icon";
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

  const setIsCenterOnMyLocation = useMapStore(
    (state) => state.setIsCenterOnMyLocation,
  );
  const setUserInfo = useMapStore((state) => state.setUserInfo);

  const failureCount = useRef<number>(0);
  const TIME_OUT = 1000;

  const handleClick = () => {
    const successCallback = ({ coords }: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = coords;
      map.setCenter({ lat, lng });
      setUserInfo({
        currentLocation: { lat, lng },
        hasLocationPermission: true,
      });
      // GoogleMap의 CameraChanged 이벤트가 발생한 후에 시행 될 수 있도록
      // setIsCenterOnMyLocation 을 이벤트 루프로 보내줍니다.
      setTimeout(() => {
        setIsCenterOnMyLocation(true);
      }, 0);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      switch (error.code) {
        case 1 /* PERMISSION_DENIED */:
          setUserInfo({
            currentLocation: { lat: 0, lng: 0 },
            hasLocationPermission: false,
          });
          throw new Error(
            "위치 제공을 허용 한 후 사용 가능한 기능입니다\n내 위치 제공을 허용해주세요",
          );

        case 2 /* POSITION_UNAVAILABLE */:
          if (failureCount.current >= 3) {
            failureCount.current = 0;
            throw new Error(
              "위치 정보를 가져오는데 문제가 발생했습니다\n잠시 후 다시 시도해주세요.",
            );
          }
          window.navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            {
              ...options,
              timeout: TIME_OUT + 2 ** failureCount.current * 100,
              enableHighAccuracy: false,
            },
          );
          break;
        case 3 /* TIMEOUT */:
          throw new Error(
            "위치 정보를 가져오는데 시간이 너무 오래 걸립니다\n잠시 후 다시 시도해주세요.",
          );
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: TIME_OUT,
      maximumAge: 0,
    };

    window.navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options,
    );
  };

  return (
    <FloatingButton
      aria-label="지도의 중심을 현재 위치로 이동 시키기"
      onClick={handleClick}
      controlledIsActive={isCenteredOnMyLocation}
    >
      <MyLocationIcon />
    </FloatingButton>
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
