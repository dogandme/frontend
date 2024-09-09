import { useMutation } from "@tanstack/react-query";
import type { AuthStore } from "@/shared/store/auth";
import { SIGN_UP_END_POINT } from "../constants";

export interface PetInfoResponse {
  code: number;
  message: string;
  content: {
    role: string;
  };
}

export interface PetInfoFormData {
  name: string;
  breed: string;
  personalities: string[];
  description: string;
  profile: File | null;
}

interface PostPetInfoArgs {
  token: NonNullable<AuthStore["token"]>;
  formObject: PetInfoFormData;
}

const postPetInfo = async ({
  token,
  formObject,
}: PostPetInfoArgs): Promise<PetInfoResponse> => {
  const { name, personalities, description, profile } = formObject;

  const formData = new FormData();

  // 이미지 파일은 파일 이름과 확장자를 붙혀 보내야 합니다.
  if (profile) {
    const profileExtension = profile.type.split("/")[1];
    formData.append("profile", profile, `${name}-profile.${profileExtension}`);
  } else {
    formData.append("profile", "");
  }

  formData.append("name", name);
  formData.append("personalities", JSON.stringify(personalities));
  formData.append("description", description);

  const response = await fetch(SIGN_UP_END_POINT.PET_INFO, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      "예기치 못한 에러가 발생했습니다.잠시 후 다시 시도해주세요.",
    );
  }

  const data = await response.json();
  return data;
};

export const usePostPetInfo = () => {
  return useMutation<PetInfoResponse, Error, PostPetInfoArgs>({
    mutationFn: postPetInfo,
  });
};
