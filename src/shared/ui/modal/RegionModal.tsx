import { useRef } from "react";
import { StoreApi, useStore } from "zustand";
import { useGetRegionByKeyword, useGetRegionByLatLng } from "@/shared/api";
import { REGION_API_DEBOUNCE_DELAY, ERROR_MESSAGE } from "@/shared/constants";
import { useRegionModalStore } from "@/shared/store";
import { useAuthStore } from "@/shared/store/auth";
import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { CancelIcon, MapLocationSearchingIcon } from "@/shared/ui/icon";
import { SearchIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { List } from "@/shared/ui/list";
import { Modal } from "@/shared/ui/modal";
import { CloseNavigationBar } from "@/shared/ui/navigationbar";

interface Region {
  address: string;
  id: number;
}

/**
 * ExternalFormStore 는 외부에서 주입 받아 사용 하는 store 입니다.
 */
type ExternalFormStore = StoreApi<{
  region: Region[];
  setRegion: (region: Region[]) => void;
}>;

interface RegionModalProps {
  onClose: () => Promise<void>;
  externalFormStore: ExternalFormStore;
}

export const RegionModal = ({
  onClose,
  externalFormStore,
}: RegionModalProps) => {
  const resetRegionModalStore = useRegionModalStore(
    (state) => state.resetRegionModalStore,
  );

  const handleRegionModalClose = async () => {
    await onClose();
    resetRegionModalStore();
  };

  return (
    <Modal modalType="fullPage">
      {/* Header */}
      <CloseNavigationBar onClick={handleRegionModalClose} />
      <section
        className="px-4 flex flex-col gap-8"
        style={{
          height: "calc(100% - 6rem)",
        }}
      >
        <section className="flex flex-col gap-4">
          {/* 검색창 */}
          <RegionSearchInput />
          {/* 현재 위치로 찾기 버튼 */}
          <SearchRegionByGPSButton />
        </section>
        <section className="flex flex-col flex-grow justify-between ">
          <div>
            {/* API 검색 결과 리스트 */}
            <SearchedRegionList externalFormStore={externalFormStore} />
          </div>
          <div className="flex flex-col gap-4 pb-8">
            {/* InfoRegistrationFormStore에 저장된 region 리스트 */}
            <SelectedRegionList externalFormStore={externalFormStore} />
            {/* 확인 버튼 */}
            <RegionModalSaveButton
              onClose={handleRegionModalClose}
              externalFormStore={externalFormStore}
            />
          </div>
        </section>
      </section>
    </Modal>
  );
};

// TODO 에러 처리 , 로딩 처리 작업 추가 예정
const RegionSearchInput = () => {
  const setKeyword = useRegionModalStore((state) => state.setKeyword);
  const setOrigin = useRegionModalStore((state) => state.setOrigin);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDebouncedChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      if (value.length > 0) {
        setKeyword(value);
        setOrigin("keyword");
      }
    }, REGION_API_DEBOUNCE_DELAY);
  };

  return (
    <Input
      id="region-search"
      componentType="searchText"
      leadingNode={<SearchIcon />}
      placeholder="동명(읍,면)으로 검색"
      onChange={handleDebouncedChange}
      ref={inputRef}
    />
  );
};

const SearchRegionByGPSButton = () => {
  const origin = useRegionModalStore((state) => state.origin);

  const setPosition = useRegionModalStore((state) => state.setPosition);
  const setOrigin = useRegionModalStore((state) => state.setOrigin);

  const additionalClassName =
    origin === "position"
      ? "border-tangerine-500 text-tangerine-500 active:border-tangerine-500 active:text-tangerine-500 hover:border-tangerine-500 hover:text-tangerine-500 focus-visible:border-tangerine-500 focus-visible:text-tangerine-500"
      : "";

  const failureCount = useRef(0);
  const TIME_OUT = 1000;

  const successCallback = ({ coords }: GeolocationPosition) => {
    const { latitude: lat, longitude: lng } = coords;
    setPosition({ lat, lng });
    setOrigin("position");
  };

  // TODO 에러 바운더리로 스낵바 띄우기
  const errorCallback = (error: GeolocationPositionError) => {
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        throw new Error(ERROR_MESSAGE.PERMISSION_DENIED);
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        throw new Error(ERROR_MESSAGE.POSITION_UNAVAILABLE);
      case GeolocationPositionError.TIMEOUT:
        if (failureCount.current >= 3) {
          failureCount.current = 0;
          throw new Error(ERROR_MESSAGE.POSITION_UNAVAILABLE);
        }
        failureCount.current += 1;
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
      default:
        throw new Error(ERROR_MESSAGE.UNKNOWN);
    }
  };

  const options = {
    enableHighAccuracy: true,
    timeout: TIME_OUT,
    maximumAge: 0,
  };

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options,
    );
  };

  return (
    <Button
      type="button"
      variant="outlined"
      colorType="tertiary"
      size="medium"
      onClick={handleClick}
      className={additionalClassName}
    >
      <MapLocationSearchingIcon />
      <span>현재 위치로 찾기</span>
    </Button>
  );
};

const SearchRegionControlList = ({
  externalFormStore,
  province,
  cityCounty,
  subDistrict,
  id,
}: {
  externalFormStore: ExternalFormStore;
  province: string;
  cityCounty: string;
  subDistrict: string;
  id: number;
}) => {
  const region = useStore(externalFormStore, (state) => state.region);
  const setRegion = useStore(externalFormStore, (state) => state.setRegion);

  const address = `${province} ${cityCounty} ${subDistrict}`;

  const handleRegion = () => {
    // TODO 에러 바운더리 나오면 에러 던지기
    if (region.length >= 5) {
      // throw new Error("동네는 최대 5개까지 선택할 수 있습니다.");
      return;
    }

    if (region.some((data) => data.address === address)) {
      return;
    }
    setRegion([...region, { address, id }]);
  };

  return (
    <List.Item
      style={{
        justifyContent: "start",
      }}
      onClick={handleRegion}
      additionalClassName="title-3"
    >{`${province} ${cityCounty} ${subDistrict}`}</List.Item>
  );
};

const SearchedRegionList = ({
  externalFormStore,
}: {
  externalFormStore: ExternalFormStore;
}) => {
  const keyword = useRegionModalStore((state) => state.keyword);
  const position = useRegionModalStore((state) => state.position);
  const origin = useRegionModalStore((state) => state.origin);

  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error("로그인 후 다시 이용해주세요");
  }

  const isOriginFromKeyword = origin === "keyword";

  const { data: addressListByKeyword } = useGetRegionByKeyword({
    keyword,
    token,
    enabled: keyword.length > 0 && isOriginFromKeyword,
  });

  const { data: addressListByLatLng } = useGetRegionByLatLng({
    ...position,
    token,
    enabled: !isOriginFromKeyword,
  });

  const addressList = isOriginFromKeyword
    ? addressListByKeyword
    : addressListByLatLng;

  if (!addressList || addressList.length === 0) {
    return <section className="flex flex-col gap-4"></section>;
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="title-2 text-grey-900">
        {isOriginFromKeyword ? keyword : "현재 위치"} 동네 검색 결과
      </h1>
      <List
        style={{
          maxHeight: "18rem",
          overflowY: "auto",
          justifyContent: "start",
        }}
      >
        {addressList.map(({ province, cityCounty, subDistrict, id }) => (
          <SearchRegionControlList
            externalFormStore={externalFormStore}
            key={id}
            province={province}
            cityCounty={cityCounty}
            subDistrict={subDistrict}
            id={id}
          />
        ))}
      </List>
    </section>
  );
};

const SelectedRegionList = ({
  externalFormStore,
}: {
  externalFormStore: ExternalFormStore;
}) => {
  const region = useStore(externalFormStore, (state) => state.region);
  const setRegion = useStore(externalFormStore, (state) => state.setRegion);

  if (region.length === 0) {
    return <section className="py-2 flex flex-col gap-4"></section>;
  }

  const handleRemoveRegion = (address: string) => {
    setRegion(region.filter((region) => region.address !== address));
  };

  return (
    <section className="py-2 flex flex-col gap-4">
      <p className="title-2">선택된 동네</p>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {region.map(({ address, id }) => (
          <li className="flex flex-shrink-0" key={id}>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              key={id}
              onClick={() => handleRemoveRegion(address)}
              isSelected={true}
            >
              {address}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};

const RegionModalSaveButton = ({
  onClose,
  externalFormStore,
}: RegionModalProps) => {
  const region = useStore(externalFormStore, (state) => state.region);

  const resetRegionModalStore = useRegionModalStore(
    (state) => state.resetRegionModalStore,
  );

  const handleCloseRegionModal = async () => {
    if (region.length === 0) {
      throw new Error(ERROR_MESSAGE.NON_SELECTED_ADDRESS);
    }
    await onClose();
    resetRegionModalStore();
  };

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleCloseRegionModal}
    >
      확인
    </Button>
  );
};
