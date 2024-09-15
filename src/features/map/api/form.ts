import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { LatLng } from "@/features/auth/api/region";
import {
  MAP_ENDPOINT,
  MarkingModalError,
  POST_VISIBILITY_MAP,
  PostVisibilityKey,
} from "../constants";

// Marking Form 저장 API
export interface MarkingFormRequest extends LatLng {
  token: string;
  region: string;
  visibility: string;
  content: string;
  images: File[];
}

interface MarkingFormResponse {
  code: number;
  message: string;
}

const postMarkingFormData = async ({
  token,
  ...formObj
}: MarkingFormRequest) => {
  const { visibility, images, ...rest } = formObj;

  if (!token) {
    throw new Error(MarkingModalError.unAuthorized);
  }

  const formData = new FormData();

  formData.append(
    "markingAddDto",
    JSON.stringify({
      visibility: POST_VISIBILITY_MAP[visibility as PostVisibilityKey],
      ...rest,
    }),
  );

  images.forEach((image) => {
    const fileName = image.name;
    formData.append("images", image, fileName);
  });

  const response = await fetch(MAP_ENDPOINT.MARKING_SAVE, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(MarkingModalError.failToFetch);
    }
    throw new Error(data.message);
  }
  return data;
};

export const usePostMarkingForm = (
  options?: UseMutationOptions<MarkingFormResponse, Error, MarkingFormRequest>,
) => {
  return useMutation({
    mutationFn: postMarkingFormData,
    ...options,
  });
};

// Marking Form 임시 저장 API

interface MarkingFormResponse {
  code: number;
  message: string;
}

const postMarkingFormDataTemporary = async ({
  token,
  ...formObj
}: MarkingFormRequest) => {
  const { region, visibility, content, images, lat, lng } = formObj;

  if (!token) {
    throw new Error(MarkingModalError.unAuthorized);
  }

  const formData = new FormData();
  formData.append(
    "markingAddDto",
    JSON.stringify({
      region,
      visibility: POST_VISIBILITY_MAP[visibility as PostVisibilityKey],
      content,
      lat,
      lng,
    }),
  );

  images.forEach((image) => {
    const fileName = image.name;
    formData.append("images", image, fileName);
  });

  const response = await fetch(MAP_ENDPOINT.MARKING_TEMP_SAVE, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(MarkingModalError.failToFetch);
    }
    throw new Error(data.message);
  }
  return data;
};

export const usePostTempMarkingForm = (
  options?: UseMutationOptions<MarkingFormResponse, Error, MarkingFormRequest>,
) => {
  return useMutation({
    mutationFn: postMarkingFormDataTemporary,
    ...options,
  });
};
