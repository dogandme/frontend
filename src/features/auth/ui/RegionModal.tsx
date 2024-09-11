import { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuthStore } from "@/shared/store/auth";
import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { CancelIcon, MapLocationSearchingIcon } from "@/shared/ui/icon";
import { SearchIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { List } from "@/shared/ui/list";
import { Modal } from "@/shared/ui/modal";
import { CloseNavigationBar } from "@/shared/ui/navigationbar";
import { useGetAddressByKeyword, useGetAddressByLatLng } from "../api/region";
import type { LatLng } from "../api/region";
import { REGION_API_DEBOUNCE_DELAY } from "../constants";
import { errorMessage } from "../constants";
import {
  useAddressModalStore,
  useUserInfoRegistrationFormStore,
} from "../store";

// TODO 에러 처리 , 로딩 처리 작업 추가 예정
const RegionSearchInput = () => {
  const [keyword, setKeyword] = useState<string>("");
  const { token } = useAuthStore.getState();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setAddressesList = useAddressModalStore(
    (state) => state.setAddressList,
  );
  const setAddressOrigin = useAddressModalStore(
    (state) => state.setAddressOrigin,
  );

  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!token) {
    throw new Error(
      "토큰이 존재하지 않습니다. 토큰이 없다면 해당 컴포넌트를 렌더링 할 수 없습니다.",
    );
  }

  const {
    data,
    isError,
    refetch: debouncedFetch,
  } = useGetAddressByKeyword({
    token,
    keyword,
  });

  useEffect(() => {
    if (data && !isError) {
      setAddressesList(data);
      setAddressOrigin(inputRef.current as HTMLInputElement);
    }
  }, [data, isError, setAddressesList, setAddressOrigin]);

  const handleDebouncedChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setKeyword(value);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      if (value.length > 0) {
        debouncedFetch();
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
  const [position, setPosition] = useState<LatLng>({ lat: 0, lng: 0 });
  const origin = useAddressModalStore((state) => state.addressOrigin);

  const setAddressesList = useAddressModalStore(
    (state) => state.setAddressList,
  );
  const setAddressOrigin = useAddressModalStore(
    (state) => state.setAddressOrigin,
  );

  const isOriginLatLng = origin && !(origin instanceof HTMLInputElement);
  const additionalCLassName = isOriginLatLng
    ? "border-tangerine-500 text-tangerine-500 active:border-tangerine-500 active:text-tangerine-500 hover:border-tangerine-500 hover:text-tangerine-500 focus-visible:border-tangerine-500 focus-visible:text-tangerine-500"
    : "";

  const failureCount = useRef(0);
  const TIME_OUT = 1000;

  const { data, isError } = useGetAddressByLatLng(position);

  useEffect(() => {
    if (data && !isError) {
      setAddressesList(data);
      setAddressOrigin(position);
    }
  }, [data, isError, position, setAddressesList, setAddressOrigin]);

  const successCallback = ({ coords }: GeolocationPosition) => {
    const { latitude: lat, longitude: lng } = coords;
    setPosition({ lat, lng });
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
      additionalClassName={additionalCLassName}
    >
      <MapLocationSearchingIcon />
      <span>현재 위치로 찾기</span>
    </Button>
  );
};

const SearchAddressControlList = ({
  province,
  cityCounty,
  subDistrict,
  id,
}: {
  province: string;
  cityCounty: string;
  subDistrict: string;
  id: number;
}) => {
  const region = useUserInfoRegistrationFormStore((state) => state.region);
  const setRegion = useUserInfoRegistrationFormStore(
    (state) => state.setRegion,
  );
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

const SearchedRegionList = () => {
  const addressList = useAddressModalStore((state) => state.addressList);
  const addressOrigin = useAddressModalStore((state) => state.addressOrigin);

  const origin =
    addressOrigin instanceof HTMLInputElement
      ? addressOrigin.value
      : "현재 위치";

  if (addressList.length === 0) {
    return <section className="flex flex-col gap-4"></section>;
  }
  return (
    <section className="flex flex-col gap-4">
      <h1 className="title-2 text-grey-900">{origin} 동네 검색 결과</h1>
      <List
        style={{
          maxHeight: "18rem",
          overflowY: "auto",
          justifyContent: "start",
        }}
      >
        {addressList.map(({ province, cityCounty, subDistrict, id }) => (
          <SearchAddressControlList
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

const SelectedRegionList = () => {
  const region = useUserInfoRegistrationFormStore((state) => state.region);
  const setRegion = useUserInfoRegistrationFormStore(
    (state) => state.setRegion,
  );

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
              isUncontrolled
            >
              {address}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};

const RegionModalCloseButton = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const region = useUserInfoRegistrationFormStore((state) => state.region);
  const handleCloseRegionModal = () => {
    if (region.length === 0) {
      throw new Error(errorMessage.NON_SELECTED_ADDRESS);
    }
    onClose();
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

export const RegionModal = ({ onClose }: { onClose: () => Promise<void> }) => {
  return (
    <Modal modalType="fullPage">
      {/* Header */}
      <CloseNavigationBar onClick={onClose} />
      {/* TODO flex grow 가 왜 안되지 ? */}
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
            <SearchedRegionList />
          </div>
          <div className="flex flex-col gap-4 pb-8">
            {/* InfoRegistrationFormStore에 저장된 region 리스트 */}
            <SelectedRegionList />
            {/* 확인 버튼 */}
            <RegionModalCloseButton onClose={onClose} />
          </div>
        </section>
      </section>
    </Modal>
  );
};
