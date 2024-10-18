import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PetInfoForm } from "@/features/auth/api";
import type { ProfileImageUrl } from "@/entities/profile/api";
import { useAuthStore } from "@/shared/store";
import { SETTING_END_POINT } from "../constants";

/**
 * 반려동물 수정 페이지에서 사용되는 FormObject 는 profile 이란 필드가 추가 됩니다.
 * 해당 필드는 MyInfo.PetInfo 인 서버에서 제공하는 프로필 url 을 담습니다.
 * 조건에 따라 값은 다음과 같습니다.
 * 1. 프로필 이미지가 삭제 된 경우 profile : null
 * 2. 프로필 이미지가 변경 되지 않은 경우 profile : MyInfo.PetInfo.profile
 * 3. 프로필 이미지가 변경 된 경우 profile : null (멀티파트 폼의 profile에선 새로운 파일이 들어갑니다.)
 */
interface PutPetInfoFormObject extends Omit<PetInfoForm, "profile"> {
  prevProfile: ProfileImageUrl | null;
}

interface PutPetInfoFormRequest extends PutPetInfoFormObject {
  profile: File | null;
}

interface PutPetInfoFormResponse {
  code: number;
  message: string;
}

const putChangePetInformation = async ({
  profile,
  prevProfile,
  ...formObj
}: PutPetInfoFormRequest): Promise<PutPetInfoFormResponse> => {
  const formData = new FormData();

  formData.append(
    "petDto",
    JSON.stringify({
      ...formObj,
      profile: prevProfile,
    }),
  );
  if (profile) {
    formData.append("image", profile);
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
