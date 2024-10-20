import { useRef, createContext } from "react";
import {
  Region,
  useGetRegionByKeyword,
  useGetRegionByLatLng,
} from "@/entities/auth/api";
import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { CancelIcon, MapLocationSearchingIcon } from "@/shared/ui/icon";
import { SearchIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { List } from "@/shared/ui/list";
import { Modal } from "@/shared/ui/modal";
import { REGION_API_DEBOUNCE_DELAY } from "../constants";
import { errorMessage } from "../constants";
import {
  createRegionModalStore,
  useRegionModalContext,
  useRegionModalStore,
} from "../store";
import type { RegionModalExternalState, RegionModalStore } from "../store";

export const RegionModalStoreContext = createContext<RegionModalStore | null>(
  null,
);

interface RegionModalStoreProviderProps {
  initialState?: RegionModalExternalState;
  children: React.ReactNode;
}

export const RegionModalStoreProvider = ({
  initialState,
  children,
}: RegionModalStoreProviderProps) => {
  const store = useRef(createRegionModalStore(initialState)).current;
  return (
    <RegionModalStoreContext.Provider value={store}>
      {children}
    </RegionModalStoreContext.Provider>
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
        throw new Error(errorMessage.PERMISSION_DENIED);
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        throw new Error(errorMessage.POSITION_UNAVAILABLE);
      case GeolocationPositionError.TIMEOUT:
        if (failureCount.current >= 3) {
          failureCount.current = 0;
          throw new Error(errorMessage.POSITION_UNAVAILABLE);
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
        throw new Error(errorMessage.UNKNOWN);
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

const SearchRegionControlItem = (region: Region) => {
  const regionModalStore = useRegionModalContext();
  const setRegionList = useRegionModalStore((state) => state.setRegionList);
  const { id, province, cityCounty, subDistrict } = region;

  const handleSelectRegion = () => {
    const { regionList } = regionModalStore.getState();
    // TODO 에러 바운더리 나오면 에러 던지기
    if (regionList.length >= 5) {
      // throw new Error("동네는 최대 5개까지 선택할 수 있습니다.");
      return;
    }

    if (regionList.some((selectedRegion) => selectedRegion.id === id)) {
      return;
    }
    setRegionList([...regionList, region]);
  };

  return (
    <List.Item
      style={{
        justifyContent: "start",
      }}
      onClick={handleSelectRegion}
      className="title-3"
    >
      {`${province} ${cityCounty} ${subDistrict}`}
    </List.Item>
  );
};

const SearchedRegionList = () => {
  const regionList = useRegionModalStore((state) => state.regionList);
  const keyword = useRegionModalStore((state) => state.keyword);
  const position = useRegionModalStore((state) => state.position);
  const origin = useRegionModalStore((state) => state.origin);

  const isOriginFromKeyword = origin === "keyword";

  const { data: regionListByKeyword } = useGetRegionByKeyword({
    keyword,
    enabled: keyword.length > 0 && isOriginFromKeyword,
  });

  const { data: regionListByLatLng } = useGetRegionByLatLng({
    ...position,
    enabled: !isOriginFromKeyword,
  });

  const regionListResponse = isOriginFromKeyword
    ? regionListByKeyword
    : regionListByLatLng;

  if (!regionListResponse || regionListResponse.length === 0) {
    return <section className="flex flex-col gap-4"></section>;
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="title-2 text-grey-900">
        {isOriginFromKeyword ? keyword : "현재 위치"} 동네 검색 결과
      </h1>
      <List
        className={`overflow-y-auto ${regionList.length > 0 ? "max-h-[18.125rem]" : ""}`}
        style={{
          justifyContent: "start",
        }}
      >
        {regionListResponse.map((region) => (
          <SearchRegionControlItem key={region.id} {...region} />
        ))}
      </List>
    </section>
  );
};

const SelectedRegionList = () => {
  const regionList = useRegionModalStore((state) => state.regionList);
  const setRegionList = useRegionModalStore((state) => state.setRegionList);

  if (regionList.length === 0) {
    return <section className="py-2 flex flex-col gap-4"></section>;
  }

  const handleRemoveRegion = (id: Region["id"]) => {
    setRegionList(regionList.filter((region) => region.id !== id));
  };

  return (
    <section className="pb-2 py-[2.5rem] flex flex-col gap-4 border-grey-200 border-t-[0.0625rem]">
      <p className="title-2">선택된 동네</p>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {regionList.map(({ province, cityCounty, subDistrict, id }) => (
          <li className="flex flex-shrink-0" key={id}>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              key={id}
              onClick={() => handleRemoveRegion(id)}
              isSelected={true}
            >
              {`${province} ${cityCounty} ${subDistrict}`}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};

const RegionModalSaveButton = ({
  onSave,
}: {
  onSave: (regionList: RegionModalExternalState["regionList"]) => void;
}) => {
  const regionModalStore = useRegionModalContext();

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={() => {
        const { regionList } = regionModalStore.getState();
        if (regionList.length === 0) {
          // TODO 에러바운더리 나오면 로직 변경 하기
          console.error("동네를 선택해 주세요");
          return;
        }
        if (regionList.length > 5) {
          // TODO 에러바운더리 나오면 로직 변경 하기
          console.error("동네는 최대 5개까지 선택할 수 있습니다.");
          return;
        }
        onSave(regionList);
      }}
    >
      확인
    </Button>
  );
};

interface RegionModalProps {
  onClose: () => Promise<void>;
  initialState?: RegionModalExternalState;
  onSave: (regionList: RegionModalExternalState["regionList"]) => void;
}

export const RegionModal = ({
  onClose,
  initialState,
  onSave,
}: RegionModalProps) => {
  return (
    <RegionModalStoreProvider initialState={initialState}>
      <Modal modalType="fullPage">
        {/* Header */}
        <Modal.Header onClick={onClose} />
        <Modal.Content className="h-[calc(100% - 6rem)]">
          <div className="flex flex-col gap-4">
            {/* 검색창 */}
            <RegionSearchInput />
            {/* 현재 위치로 찾기 버튼 */}
            <SearchRegionByGPSButton />
          </div>
          <div className="flex flex-col gap-8 flex-grow justify-between">
            {/* API 검색 결과 리스트 */}
            <SearchedRegionList />
          </div>
        </Modal.Content>
        <Modal.Footer axis="col">
          {/* InfoRegistrationFormStore에 저장된 region 리스트 */}
          <SelectedRegionList />
          {/* 확인 버튼 */}
          <RegionModalSaveButton onSave={onSave} />
        </Modal.Footer>
      </Modal>
    </RegionModalStoreProvider>
  );
};
