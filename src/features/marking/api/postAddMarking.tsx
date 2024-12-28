import { useMutation } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import type { LatLng } from "@/entities/map/types/client";
import type { IsVisible } from "@/entities/marking/types/server";
import { apiClient } from "@/shared/lib";
import { useSnackbar } from "@/shared/store/snackbar";
import { MARKING_END_POINT } from "../constants";
import { useMarkingFormStore } from "../store";

export interface PostAddMarkingRequest extends NonNullableObject<LatLng> {
  region: string;
  isVisible: IsVisible;
  content: string;
  images: File[];
}

const postAddMarking = async (formObj: PostAddMarkingRequest) => {
  const { images, ...rest } = formObj;

  const formData = new FormData();

  formData.append(
    "markingAddDto",
    new Blob([JSON.stringify(rest)], { type: "application/json" }),
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

export const usePostAddMarking = () => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);
  const handleOpenSnackbar = useSnackbar("map");
  return useMutation({
    mutationKey: ["markingFormModal"],
    mutationFn: postAddMarking,
    onSuccess: () => {
      resetMarkingFormStore();
      setMode("view");
      handleOpenSnackbar("내 마킹이 추가되었습니다");
    },
  });
};
