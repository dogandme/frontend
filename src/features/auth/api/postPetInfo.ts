import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PetInfo } from "@/entities/profile/api";
import { useAuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { SIGN_UP_END_POINT } from "../constants";

interface PostPetInfoResponseData {
  code: number;
  message: string;
  content: {
    role: string;
    authorization: string;
  };
}

export type PetInfoFormObject = Omit<PetInfo, "profile">;
export interface ProfileImage {
  image: File | null;
}

export type PostPetInfoRequestData = PetInfoFormObject & ProfileImage;

const postPetInfo = async ({
  image,
  ...petInfoFormObject
}: PostPetInfoRequestData): Promise<PostPetInfoResponseData> => {
  const formData = new FormData();

  // 이미지 파일은 파일 이름과 확장자를 붙혀 보내야 합니다.
  if (image) {
    const profileExtension = image.type.split("/")[1];
    formData.append("image", image, `${name}-profile.${profileExtension}`);
  }

  formData.append("petSignUpDto", JSON.stringify(petInfoFormObject));

  const response = await fetch(SIGN_UP_END_POINT.PET_INFO, {
    method: "POST",
    headers: {
      Authorization: useAuthStore.getState().token!,
    },
    credentials:
      process.env.NODE_ENV === "development" ? "include" : "same-origin",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(
        "예기치 못한 에러가 발생했습니다.잠시 후 다시 시도해주세요.",
      );
    }
    throw new Error(data.message);
  }

  return data;
};

export const usePostPetInfo = () => {
  const setRole = useAuthStore((state) => state.setRole);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  return useMutation<PostPetInfoResponseData, Error, PostPetInfoRequestData>({
    mutationFn: postPetInfo,
    onSuccess: (data) => {
      const { role, authorization: token } = data.content;
      const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

      setRole(role);
      setToken(token);
      navigate(lastNoneAuthRoute);
    },

    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
