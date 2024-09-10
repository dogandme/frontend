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
import { useAddressModalStore } from "../store";

// TODO inputRef 로 비제어 컴포넌트로 관리하기
const AddressesSearchInput = () => {
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

const SearchAddressesByGPSButton = () => {
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

const SearchedAddressList = () => {
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
        {addressList.map((region , idx) => {
          const {cityCounty , district} = region;

          return (
            (
              <List.Item
                key={idx}
                style={{ justifyContent: "start" }}
                additionalClassName="title-3"
              >
                {cityCounty + district}
              </List.Item>
            ))}
          )
        })}
      </List>
    </section>
  );
};

export const RegionModal = ({ onClose }: { onClose: () => Promise<void> }) => {
  // TODO API 요청으로 받아오기
  const regionList = [
    "영등포 1동",
    "영등포 2동",
    "영등포 3동",
    "영등포 4동",
    "영등포 5동",
    "영등포 6동",
    "영등포 7동",
  ];
  const selectedRegionList = ["영등포 1동", "영등포 2동", "영등포 3동"];

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
        <div className="flex flex-col gap-4">
          {/* 검색창 */}
          <AddressesSearchInput />
          {/* 현재 위치로 찾기 버튼 */}
          <SearchAddressesByGPSButton />
        </div>
        <div className="flex flex-col flex-grow justify-between ">
          <div>
            {/* 검색 리스트 */}
            <section className="flex flex-col gap-4">
              {regionList.length > 0 && (
                <>
                  <h1 className="title-2 text-grey-900">검색 결과</h1>
                  <List
                    style={{
                      maxHeight: "18rem",
                      overflowY: "auto",
                      justifyContent: "start",
                    }}
                  >
                    {regionList.map((region, idx) => (
                      <List.Item
                        key={idx}
                        style={{ justifyContent: "start" }}
                        additionalClassName="title-3"
                      >
                        {region}
                      </List.Item>
                    ))}
                  </List>
                </>
              )}
            </section>
          </div>
          <div className="flex flex-col gap-4 pb-8">
            {/* 검색 결과 리스트 */}
            <section className="py-2 flex flex-col gap-4">
              {selectedRegionList.length > 0 && (
                <>
                  <p className="title-2">선택된 동네</p>
                  <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
                    {selectedRegionList.map((selectedRegion, idx) => (
                      <li className="flex flex-shrink-0">
                        <ActionChip
                          variant="outlined"
                          label={selectedRegion}
                          trailingIcon={<CancelIcon width={20} height={20} />}
                          unControlledInitialIsSelect={true}
                          key={idx}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
            {/* 확인 버튼 */}
            <Button colorType="primary" variant="filled" size="medium">
              확인
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};
