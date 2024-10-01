import { useMutation } from "@tanstack/react-query";
import { LatLng } from "@/features/auth/api/region";
import {
  MARKING_ADD_ERROR_MESSAGE,
  MARKING_REQUEST_URL,
  POST_VISIBILITY_MAP,
} from "../constants";

// Marking Form 저장 API
export interface MarkingFormRequest extends LatLng {
  token: string;
  region: string;
  visibility: keyof typeof POST_VISIBILITY_MAP;
  content: string;
  images: File[];
}

const postMarkingFormData = async ({
  token,
  ...formObj
}: MarkingFormRequest) => {
  const { visibility, images, ...rest } = formObj;

  if (!token) {
    throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
  }

  const formData = new FormData();

  formData.append(
    "markingAddDto",
    JSON.stringify({
      visibility: POST_VISIBILITY_MAP[visibility],
      ...rest,
    }),
  );

  images.forEach((image) => {
    const fileName = image.name;
    formData.append("images", image, fileName);
  });

  const response = await fetch(MARKING_REQUEST_URL.ADD, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(MARKING_ADD_ERROR_MESSAGE.FAIL_TO_FETCH);
    }
    throw new Error(data.message);
  }
  return data;
};

export const usePostMarkingForm = () => {
  return useMutation({
    mutationFn: postMarkingFormData,
  });
};
