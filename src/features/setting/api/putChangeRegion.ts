import { useMutation } from "@tanstack/react-query";
import type { Region } from "@/features/auth/api/region";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

export interface PutChangeRegionRequestData {
  removeIds: Region["id"][];
  addIds: Region["id"][];
}

interface PutChangeRegionResponseData {
  code: number;
  message: string;
}

const putChangeRegion = async (
  putChangeRequestData: PutChangeRegionRequestData,
) => {
  const response = await fetch(SETTING_END_POINT.CHANGE_GENDER, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: useAuthStore.getState().token!,
    },
    body: JSON.stringify(putChangeRequestData),
  });

  const data = (await response.json()) as PutChangeRegionResponseData;

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutChangeRegion = () => {
  return useMutation({
    mutationFn: putChangeRegion,
    mutationKey: ["putChangeRegion"],
  });
};
