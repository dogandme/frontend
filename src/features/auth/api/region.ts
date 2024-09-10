import { useQuery } from "@tanstack/react-query";
import { ADDRESSES_END_POINT } from "../constants";
import { errorMessage } from "../constants";

export interface LatLng {
  lat: number;
  lng: number;
}

type AddressKeyword = string;

export interface Address {
  id: number;
  province: string;
  cityCounty: string;
  district: string;
  subDistrict: string;
}

export type AddressResponse = Address[];

const getAddressByKeyword = async (
  keyword: AddressKeyword,
): Promise<AddressResponse> => {
  const response = await fetch(ADDRESSES_END_POINT.ADDRESS(keyword));

  // TODO 에러 바운더리로 처리하기
  if (!response.ok) {
    throw new Error(errorMessage.UNKNOWN);
  }
  const data = await response.json();
  // TODO 백엔드와 데이터 처리 어떻게 할지 살펴보기
  if (data.code > 200) {
    throw new Error(data.message);
  }
  const addressList = data.content as AddressResponse;
  return addressList;
};

export const useGetAddressByKeyword = ({
  keyword,
  enabled,
}: {
  keyword: AddressKeyword;
  enabled: boolean;
}) => {
  return useQuery<AddressResponse, Error>({
    queryKey: ["addresses", keyword],
    queryFn: () => getAddressByKeyword(keyword),
    enabled,
  });
};

const getAddressByLatLng = async ({
  lat,
  lng,
}: LatLng): Promise<AddressResponse> => {
  const response = await fetch(
    ADDRESSES_END_POINT.CURRENT_POSITION({ lat, lng }),
  );

  // TODO 에러 바운더리로 처리하기
  if (!response.ok) {
    throw new Error(errorMessage.UNKNOWN);
  }
  const data = await response.json();
  // TODO 백엔드와 데이터 처리 어떻게 할지 살펴보기
  if (data.code > 200) {
    throw new Error(data.message);
  }

  const addressList = data.content as AddressResponse;
  return addressList;
};

export const useGetAddressByLatLng = ({ lat, lng }: LatLng) => {
  return useQuery<AddressResponse, Error>({
    queryKey: ["addresses", lat, lng],
    queryFn: () => getAddressByLatLng({ lat, lng }),
    enabled: !!lat && !!lng, // lat,  lng 가 모두 존재할 때만 쿼리를 실행합니다.
  });
};
