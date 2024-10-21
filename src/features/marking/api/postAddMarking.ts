import { useMutation } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import type { LatLng } from "@/entities/auth/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT, POST_VISIBILITY_MAP } from "../constants";
import { useMarkingFormStore } from "../store";

// Marking Form 저장 API
export interface PostAddMarkingRequest extends LatLng {
  region: string;
  isVisible: keyof typeof POST_VISIBILITY_MAP;
  content: string;
  images: File[];
}

const postAddMarking = async (formObj: PostAddMarkingRequest) => {
  const { isVisible, images, ...rest } = formObj;

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

  return apiClient.post(MARKING_END_POINT.ADD, {
    withToken: true,
    body: formData,
  });
};

export const usePostAddMarking = ({ onSuccess }: { onSuccess: () => void }) => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);

  return useMutation<unknown, Error, PostAddMarkingRequest>({
    mutationFn: postAddMarking,
    onSuccess: () => {
      onSuccess();
      resetMarkingFormStore();
      setMode("view");
    },
  });
};
