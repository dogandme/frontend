// Marking Form 임시 저장 API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMapStore } from "@/features/map/store";
import { profileQueryKey } from "@/entities/profile/api";
import { apiClient } from "@/shared/lib";
import { useSnackBarStore } from "@/shared/store";
import { MARKING_END_POINT } from "../constants";
import { useMarkingFormStore } from "../store";
import type { PostAddMarkingRequest } from "./postAddMarking";

type PostAddTempMarkingRequest = PostAddMarkingRequest;

const postAddTempMarking = async (formObj: PostAddTempMarkingRequest) => {
  const { region, isVisible, content, images, lat, lng } = formObj;

  const formData = new FormData();

  formData.append(
    "markingAddDto",
    new Blob(
      [
        JSON.stringify({
          region,
          isVisible,
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

  return apiClient.post(MARKING_END_POINT.SAVE_TEMP, {
    withToken: true,
    body: formData,
  });
};

export const usePostAddTempMarking = () => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);
  const setSnackbarProps = useSnackBarStore((state) => state.setSnackbarProps);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["markingFormModal"],
    mutationFn: postAddTempMarking,
    onSuccess: () => {
      resetMarkingFormStore();
      setMode("view");
      setSnackbarProps(
        <>
          <p>임시저장 되었습니다</p>
          <p>내 마킹에서 저장을 완료해 주세요</p>
        </>,
        {
          type: "map",
        },
      );
      queryClient.invalidateQueries({
        queryKey: profileQueryKey.myProfile(),
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });
};
