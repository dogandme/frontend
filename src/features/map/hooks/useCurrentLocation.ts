import { useState } from "react";
import { useMapStore } from "../store";

type OnSuccess = (position: GeolocationPosition) => void;
type OnError = () => void;

export const useCurrentLocation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const setUserInfo = useMapStore((state) => state.setUserInfo);

  const MAX_WAIT_TIME = 5000;

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: MAX_WAIT_TIME,
    maximumAge: 0,
  };

  const successCallback = (
    position: GeolocationPosition,
    onSuccess?: OnSuccess,
  ) => {
    const { coords } = position;
    const { latitude: lat, longitude: lng } = coords;

    setLoading(false);

    setUserInfo({
      currentLocation: { lat, lng },
      hasLocationPermission: true,
    });
    onSuccess?.(position);
  };

  const errorCallback = (
    error: GeolocationPositionError,
    onError?: OnError,
  ) => {
    setLoading(false);

    setUserInfo({
      currentLocation: { lat: null, lng: null },
      hasLocationPermission: false,
    });
    onError?.();

    switch (error.code) {
      case 1 /* PERMISSION_DENIED */:
        throw new Error(
          "위치 제공을 허용 한 후 사용 가능한 기능입니다\n내 위치 제공을 허용해주세요",
        );

      case 2 /* POSITION_UNAVAILABLE */:
        throw new Error(
          "위치 정보를 가져오는데 문제가 발생했습니다\n잠시 후 다시 시도해주세요.",
        );

      case 3 /* TIMEOUT */:
        throw new Error(
          "위치 정보를 가져오는데 시간이 너무 오래 걸립니다\n잠시 후 다시 시도해주세요.",
        );
    }
  };

  const setCurrentLocation = ({
    onSuccess,
    onError,
  }: {
    onSuccess?: OnSuccess;
    onError?: OnError;
  }) => {
    // 스토리북 환경에선 이하 코드를 실행하지 않습니다.
    if (
      (
        window as Window &
          typeof globalThis & { __STORYBOOK_ADDONS_CHANNEL__?: unknown }
      ).__STORYBOOK_ADDONS_CHANNEL__
    ) {
      return;
    }

    setLoading(true);

    window.navigator.geolocation.getCurrentPosition(
      (position) => successCallback(position, onSuccess),
      (position) => errorCallback(position, onError),
      options,
    );
  };

  return { loading, setCurrentLocation };
};
