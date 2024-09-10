import { useEffect, useRef } from "react";
import { useState } from "react";
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
import { DELAY } from "../constants";
import { errorMessage } from "../constants";
import {
  useAddressModalStore,
  useUserInfoRegistrationFormStore,
} from "../store";

// TODO inputRef 로 비제어 컴포넌트로 관리하기
// TODO 에러 처리 , 로딩 처리 작업 추가 예정

const RegionSearchInput = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [isQueryEnabled, setIsQueryEnabled] = useState<boolean>(false);
  const setAddressesList = useAddressModalStore(
    (state) => state.setAddressList,
  );

  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isError } = useGetAddressByKeyword({
    keyword,
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    if (data && !isError) {
      setAddressesList(data);
    }
  }, [data, setAddressesList, isError]);

  const handleDebouncedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
    setIsQueryEnabled(false);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      setIsQueryEnabled(value.length > 0 ? true : false);
    }, DELAY);
  };

  return (
    <Input
      id="region-search"
      componentType="searchText"
      leadingNode={<SearchIcon />}
      placeholder="동명(읍,면)으로 검색"
      onChange={handleDebouncedChange}
    />
  );
};

const SearchRegionByGPSButton = () => {
  const [position, setPosition] = useState<LatLng>({ lat: 0, lng: 0 });
  const setAddressesList = useAddressModalStore(
    (state) => state.setAddressList,
  );
  const failureCount = useRef(0);
  const TIME_OUT = 1000;

  const { data, isError } = useGetAddressByLatLng(position);

  useEffect(() => {
    if (data && !isError) {
      setAddressesList(data);
    }
  }, [data, setAddressesList, isError]);

  const successCallback = (position: GeolocationPosition) => {
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;
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
            timeout: TIME_OUT / (2 ** failureCount.current * 100),
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
    >
      <MapLocationSearchingIcon />
      <span>현재 위치로 찾기</span>
    </Button>
  );
};

const SearchAddressControlList = ({
  province,
  cityCounty,
  district,
  id,
}: {
  province: string;
  cityCounty: string;
  district: string;
  id: number;
}) => {
  const region = useUserInfoRegistrationFormStore((state) => state.region);
  const setRegion = useUserInfoRegistrationFormStore(
    (state) => state.setRegion,
  );
  const address = `${province} ${cityCounty} ${district}`;

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
    // TODO 추가 className 받을 수 있도록 변경하기
    // TODO 현재 폰트가 인식 되지 않고 있음
    <List.Item
      style={{
        justifyContent: "start",
      }}
      onClick={handleRegion}
    >{`${province} ${cityCounty} ${district}`}</List.Item>
  );
};

const SearchedRegionList = () => {
  const addressList = useAddressModalStore((state) => state.addressList);

  if (addressList.length === 0) {
    return <section className="flex flex-col gap-4"></section>;
  }
  return (
    <section className="flex flex-col gap-4">
      <h1 className="title-2 text-grey-900">검색 결과</h1>
      <List
        style={{
          maxHeight: "18rem",
          overflowY: "auto",
          justifyContent: "start",
        }}
      >
        {addressList.map((address) => {
          const { province, cityCounty, district, id } = address;
          return (
            <SearchAddressControlList
              key={id}
              province={province}
              cityCounty={cityCounty}
              district={district}
              id={id}
            />
          );
        })}
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
              label={address}
              trailingIcon={<CancelIcon width={20} height={20} />}
              controlledIsSelected={true}
              key={id}
              onClick={() => handleRemoveRegion(address)}
            />
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
