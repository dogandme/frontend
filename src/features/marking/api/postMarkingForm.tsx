import { useMutation } from "@tanstack/react-query";
import { LatLng } from "@/features/auth/api/region";
import { useMapStore } from "@/features/map/store";
import { useSnackBar } from "@/shared/lib";
import { AuthStore } from "@/shared/store";
import {
  MARKING_ADD_ERROR_MESSAGE,
  MARKING_REQUEST_URL,
  POST_VISIBILITY_MAP,
} from "../constants";
import { useMarkingFormStore } from "../store";

// Marking Form 저장 API
export interface MarkingFormRequest extends LatLng {
  token: NonNullable<AuthStore["token"]>;
  region: string;
  isVisible: keyof typeof POST_VISIBILITY_MAP;
  content: string;
  images: File[];
}

const postMarkingFormData = async ({
  token,
  ...formObj
}: MarkingFormRequest) => {
  const { isVisible, images, ...rest } = formObj;

  if (!token) {
    throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
  }

  const formData = new FormData();

  formData.append(
    "markingAddDto",
    new Blob(
      [
        JSON.stringify({
          isVisible: POST_VISIBILITY_MAP[isVisible],
          ...rest,
        }),
      ],
      { type: "application/json" },
    ),
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
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);

  const handleOpenSnackbar = useSnackBar();

  return useMutation({
    mutationFn: postMarkingFormData,
    onSuccess: () => {
      resetMarkingFormStore();
      setMode("view");
      handleOpenSnackbar("내 마킹이 추가되었습니다", {
        type: "map",
      });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
