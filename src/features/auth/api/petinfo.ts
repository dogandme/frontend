import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore, AuthStore } from "@/shared/store/auth";
import { useRouteHistoryStore } from "@/shared/store/history";
import { SIGN_UP_END_POINT } from "../constants";

export interface PetInfoResponse {
  code: number;
  message: string;
  content: {
    role: string;
    authorization: string;
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
  const { name, personalities, description, breed, profile } = formObject;

  const formData = new FormData();

  // 이미지 파일은 파일 이름과 확장자를 붙혀 보내야 합니다.
  if (profile) {
    const profileExtension = profile.type.split("/")[1];
    formData.append("image", profile, `${name}-profile.${profileExtension}`);
  } else {
    formData.append("image", "");
  }

  formData.append(
    "petSignUpDto",
    JSON.stringify({
      name,
      personalities,
      description,
      breed,
    }),
  );

  const response = await fetch(SIGN_UP_END_POINT.PET_INFO, {
    method: "POST",
    headers: {
      Authorization: token,
    },
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

  return useMutation<PetInfoResponse, Error, PostPetInfoArgs>({
    mutationFn: postPetInfo,
    onSuccess: (data) => {
      const { role, authorization } = data.content;
      const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

      setRole(role);
      setToken(authorization);
      navigate(lastNoneAuthRoute);
    },
    // TODO 에러 바운더리 생성되면 로직 변경하기
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
