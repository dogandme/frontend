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
  token: string,
): Promise<AddressResponse> => {
  const response = await fetch(ADDRESSES_END_POINT.ADDRESS(keyword), {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

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
  token,
  keyword,
  enabled = false,
}: {
  token: string;
  keyword: AddressKeyword;
  enabled: boolean;
}) => {
  return useQuery<AddressResponse, Error>({
    queryKey: ["addresses", keyword],
    queryFn: () => getAddressByKeyword(keyword, token),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

const getAddressByLatLng = async ({
  lat,
  lng,
  token,
}: LatLng & { token: string }): Promise<AddressResponse> => {
  const response = await fetch(
    ADDRESSES_END_POINT.CURRENT_POSITION({ lat, lng }),
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    },
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

export const useGetAddressByLatLng = ({
  lat,
  lng,
  token,
  enabled = false,
}: LatLng & { token: string; enabled: boolean }) => {
  return useQuery<AddressResponse, Error>({
    queryKey: ["addresses", lat, lng],
    queryFn: () => getAddressByLatLng({ lat, lng, token }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
