import { useMutation } from "@tanstack/react-query";
import { LatLng } from "@/features/auth/api/region";
import {
  MAP_ENDPOINT,
  MarkingModalError,
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
    throw new Error(MarkingModalError.unAuthorized);
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

  const response = await fetch(MAP_ENDPOINT.MARKING_SAVE, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
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

export const usePostMarkingForm = () => {
  return useMutation({
    mutationFn: postMarkingFormData,
  });
};

// Marking Form 임시 저장 API

const postMarkingFormDataTemporary = async ({
  token,
  ...formObj
}: Omit<MarkingFormRequest, "visibility"> & {
  visibility: keyof typeof POST_VISIBILITY_MAP | "";
}) => {
  const { region, visibility, content, images, lat, lng } = formObj;

  if (!token) {
    throw new Error(MarkingModalError.unAuthorized);
  }

  const formData = new FormData();
  formData.append(
    "markingAddDto",
    JSON.stringify({
      region,
      visibility: visibility ? POST_VISIBILITY_MAP[visibility] : null,
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

export const usePostTempMarkingForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  return useMutation({
    mutationFn: postMarkingFormDataTemporary,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
