import { useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { useMarkingFormStore } from "@/features/marking/store";
import { MarkingFormCloseModal } from "@/features/marking/ui/markingFormCloseModal";
import { CurrentLocationLoading } from "@/entities/map/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useModal, useSnackBar } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import {
  BookmarkIcon,
  DogFootIcon,
  ExitIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { MarkingFormModal } from "../../marking/ui";
import {
  useCurrentLocation,
  useGetMapCurrentBounds,
  useMapMode,
} from "../hooks";
import { useMapStore } from "../store";

/* ----------default mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingAddButton = () => {
  const setMode = useMapStore((state) => state.setMode);

  const handleOpenSnackbar = useSnackBar();

  const handleClick = () => {
    handleOpenSnackbar("마킹 위치를 손가락으로 움직여서 선택해 주세요", {
      type: "map",
    });
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
  const navigate = useNavigate();
  const mapMode = useMapMode();
  const map = useMap();

  const shouldShowMyMarking = mapMode === "MY_MARK";
  const getCurrentBounds = useGetMapCurrentBounds();

  return (
    <Button
      type="button"
      variant={shouldShowMyMarking ? "filled" : "outlined"}
      colorType={shouldShowMyMarking ? "primary" : "tertiary"}
      size="medium"
      className={`${buttonBaseStyles} rounded-b-none`}
      aria-label="내 마킹만 보기"
      onClick={() => {
        map.setZoom(10);
        const { northEastLat, northEastLng, southWestLat, southWestLng } =
          getCurrentBounds();

        navigate(
          `${ROUTER_PATH.MY_MARK}?boundsNELat=${northEastLat}&boundsNELng=${northEastLng}&boundsSWLat=${southWestLat}&boundsSWLng=${southWestLng}&sortType=POPULARITY`,
        );
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
  const navigate = useNavigate();
  const mode = useMapMode();
  const isCollectionActive = mode === "MY_ACTIVITY";

  return (
    <Button
      type="button"
      variant="outlined"
      colorType={isCollectionActive ? "primary" : "tertiary"}
      size="medium"
      className="shadow-custom-1 border-none"
      aria-label="좋아요를 눌렀거나 저장한 마킹들 나타내기"
      onClick={() => {
        navigate(ROUTER_PATH.MY_ACTIVITY);
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
  const { onClose, handleOpen } = useModal(() => (
    <MarkingFormCloseModal onCloseExitModal={onClose} />
  ));

  const setMode = useMapStore((state) => state.setMode);

  const handleClick = () => {
    const { images, isVisible, content } = useMarkingFormStore.getState();

    if (images.length > 0 || content || isVisible) {
      handleOpen();
      return;
    }
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
