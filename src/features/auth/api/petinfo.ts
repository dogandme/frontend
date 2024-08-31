import { useMutation } from "@tanstack/react-query";
import { SIGN_UP_END_POINT } from "../constants";

export interface PetInfoResponse {
  code: number;
  message: string;
  content: {
    role: string;
  };
}

export interface PetInfoFormData {
  userId: number;
  name: string;
  breed: string;
  personalities: string[];
  description: string;
  profile: File | null;
}

const postPetInfo = async (formObject: PetInfoFormData) => {
  const { userId, name, personalities, description, profile } = formObject;

  const formData = new FormData();

  // 이미지 파일은 파일 이름과 확장자를 붙혀 보내야 합니다.
  if (profile) {
    const profileExtension = profile.type.split("/")[1];
    formData.append("profile", profile, `${name}-profile.${profileExtension}`);
  } else {
    formData.append("profile", "");
  }

  formData.append("userid", userId.toString());
  formData.append("name", name);
  formData.append("personalities", JSON.stringify(personalities));
  formData.append("description", description);

  const response = await fetch(SIGN_UP_END_POINT.PET_INFO, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
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
  return useMutation<PetInfoResponse, Error, PetInfoFormData>({
    mutationFn: (formData) => postPetInfo(formData),
  });
};
