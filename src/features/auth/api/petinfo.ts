import { useMutation } from "@tanstack/react-query";

interface PetInfoReeponse {
  code: number;
  message: string;
  contetn: {
    role: string;
  };
}

interface PetInfoFormData {
  userId: number;
  name: string;
  personalities: string[];
  description: string;
  profile: File;
}

const postPetInfo = async (formObject: PetInfoFormData) => {
  const { userId, name, personalities, description, profile } = formObject;

  const formData = new FormData();
  formData.append("profile", profile, `${name}-profile`);
  formData.append("userid", userId.toString());
  formData.append("name", name);
  formData.append("personalities", JSON.stringify(personalities));
  formData.append("description", description);

  const response = await fetch("http://localhost:3000/pet", {
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
  return useMutation<PetInfoReeponse, Error, PetInfoFormData>({
    mutationFn: (formData) => postPetInfo(formData),
  });
};
