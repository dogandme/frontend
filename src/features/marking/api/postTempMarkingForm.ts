// Marking Form 임시 저장 API
import { useMutation } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import {
  MARKING_ADD_ERROR_MESSAGE,
  MARKING_REQUEST_URL,
  POST_VISIBILITY_MAP,
} from "../constants";
import { useMarkingFormStore } from "../store";
import { MarkingFormRequest } from "./postMarkingForm";

const postMarkingFormDataTemporary = async ({
  token,
  ...formObj
}: Omit<MarkingFormRequest, "visibility"> & {
  visibility: keyof typeof POST_VISIBILITY_MAP | "";
}) => {
  const { region, visibility, content, images, lat, lng } = formObj;

  if (!token) {
    throw new Error(MARKING_ADD_ERROR_MESSAGE.UNAUTHORIZED);
  }

  const formData = new FormData();
  formData.append(
    "markingAddDto",
    new Blob(
      [
        JSON.stringify({
          region,
          isVisible: visibility ? POST_VISIBILITY_MAP[visibility] : null,
          content,
          lat,
          lng,
        }),
      ],
      { type: "application/json" },
    ),
  );

  images.forEach((image) => {
    const fileName = image.name;
    formData.append("images", image, fileName);
  });

  const response = await fetch(MARKING_REQUEST_URL.SAVE_TEMP, {
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

export const usePostTempMarkingForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);

  return useMutation({
    mutationFn: postMarkingFormDataTemporary,
    onSuccess: () => {
      onSuccess();
      resetMarkingFormStore();
      setMode("view");
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
