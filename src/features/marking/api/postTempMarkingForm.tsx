// Marking Form 임시 저장 API
import { useMutation } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { MapSnackbar } from "@/entities/map/ui";
import { useSnackBar } from "@/shared/lib";
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
  isVisible: keyof typeof POST_VISIBILITY_MAP | "";
}) => {
  const { region, isVisible, content, images, lat, lng } = formObj;

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
          isVisible: isVisible ? POST_VISIBILITY_MAP[isVisible] : null,
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

export const usePostTempMarkingForm = () => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);
  const { handleOpen, onClose } = useSnackBar(() => (
    <MapSnackbar onClose={onClose}>
      <p>임시저장 되었습니다</p>
      <p>내 마킹에서 저장을 완료해 주세요</p>
    </MapSnackbar>
  ));

  return useMutation({
    mutationFn: postMarkingFormDataTemporary,
    onSuccess: () => {
      resetMarkingFormStore();
      setMode("view");
      handleOpen();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
