import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PetInfo } from "@/entities/profile/api";
import { profileQueryKey } from "@/entities/profile/constants";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

type PetInfoFormObject = Omit<PetInfo, "profile" | "petId">;

interface ProfileImage {
  image: File | null;
}

export type PutChangePetInfoRequest = PetInfoFormObject &
  ProfileImage & {
    isChaProfile: boolean;
  };

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
  const nickname = useAuthStore((state) => state.nickname);

  return useMutation<unknown, Error, PutChangePetInfoRequest>({
    mutationFn: putChangePetInfo,
    mutationKey: ["putChangePetInfo"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKey.profile(nickname!),
      });
    },
    onError: (error) => {
      // TODO 에러 바운더리 나오면 수정 하기
      console.error(error);
    },
  });
};
