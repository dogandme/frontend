import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PetInfo } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { SIGN_UP_END_POINT } from "../constants";

interface PostPetInfoResponseData {
  role: string;
  authorization: string;
}

type PetInfoFormObject = Omit<PetInfo, "profile">;

interface ProfileImage {
  image: File | null;
}

type PostPetInfoRequestData = PetInfoFormObject & ProfileImage;

const postAddPetInfo = async ({
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

  return apiClient.post<PostPetInfoResponseData>(SIGN_UP_END_POINT.PET_INFO, {
    withToken: true,
    credentials:
      process.env.NODE_ENV === "development" ? "include" : "same-origin",
    body: formData,
  });
};

export const usePostAddPetInfo = () => {
  const setRole = useAuthStore((state) => state.setRole);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  return useMutation<PostPetInfoResponseData, Error, PostPetInfoRequestData>({
    mutationFn: postAddPetInfo,
    onSuccess: (data) => {
      const { role, authorization: token } = data;
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
