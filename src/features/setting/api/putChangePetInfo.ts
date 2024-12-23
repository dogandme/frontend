import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileQueryKey } from "@/entities/profile/api";
import type { PetInfo } from "@/entities/profile/types/server";
import { apiClient } from "@/shared/lib";
import { SETTING_END_POINT } from "../constants";

export interface PutChangePetInfoRequest
  extends Omit<PetInfo, "profile" | "petId"> {
  image: File | null;
  isChaProfile: boolean;
}

const putChangePetInfo = async ({
  image,
  ...changePetInfoFormObject
}: PutChangePetInfoRequest) => {
  const formData = new FormData();

  formData.append("petDto", JSON.stringify(changePetInfoFormObject));
  if (image) {
    formData.append("image", image);
  }

  return apiClient.put(SETTING_END_POINT.CHANGE_PET_INFO, {
    withToken: true,
    body: formData,
  });
};

export const usePutChangePetInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PutChangePetInfoRequest>({
    mutationFn: putChangePetInfo,
    mutationKey: ["putChangePetInfo"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKey.myProfile(),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
