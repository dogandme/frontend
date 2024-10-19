import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPetInfoRequestData } from "@/features/auth/api";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

export interface PutChangePetInformationRequest extends PostPetInfoRequestData {
  isChaProfile: boolean;
}

interface PutPetInfoFormResponse {
  code: number;
  message: string;
}

const putChangePetInformation = async ({
  image,
  ...changePetInfoFormObject
}: PutChangePetInformationRequest): Promise<PutPetInfoFormResponse> => {
  const formData = new FormData();

  formData.append("petDto", JSON.stringify(changePetInfoFormObject));
  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(SETTING_END_POINT.CHANGE_PET_INFO, {
    method: "PUT",
    headers: {
      Authorization: useAuthStore.getState().token!,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const usePutChangePetInformation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putChangePetInformation,
    mutationKey: ["putChangePetInformation"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", useAuthStore.getState().nickname],
      });
    },
    onError: (error) => {
      // TODO 에러 바운더리 나오면 수정 하기
      console.error(error);
    },
  });
};
