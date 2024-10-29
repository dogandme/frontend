import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  GetTemporaryMarkingListResponse,
  TempMarkingFileInfo,
  TempMarkingInfo,
} from "@/entities/marking/api";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

export interface PutModifyTempMarkingRequest
  extends Pick<TempMarkingInfo, "isVisible"> {
  content: NonNullable<TempMarkingInfo["content"]>;
  id: TempMarkingInfo["markingId"];
  removeIds: TempMarkingFileInfo["id"][];
  isTempSaved: boolean;
  images: File[];
}

export const usePutModifyTempMarking = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, PutModifyTempMarkingRequest>({
    mutationFn: ({ images, ...formObj }: PutModifyTempMarkingRequest) => {
      const formData = new FormData();
      formData.append(
        "markingModifyDto",
        new Blob([JSON.stringify(formObj)], { type: "application/json" }),
      );
      images.forEach((image) => {
        formData.append("images", image);
      });
      return apiClient.put(MARKING_END_POINT.PUT_MODIFY_TEMP_MARKING, {
        withToken: true,
        body: formData,
      });
    },

    onSuccess: (_data, { isTempSaved, id }) => {
      if (isTempSaved) {
        queryClient.invalidateQueries({
          queryKey: ["temporaryMarkingList"],
        });
        return;
      }
      queryClient.setQueryData<InfiniteData<GetTemporaryMarkingListResponse>>(
        ["temporaryMarkingList"],
        (data) => {
          if (!data) {
            return data;
          }
          const { pages } = data;
          const newPages = pages.map((page) => ({
            ...page,
            markings: page.markings.filter(({ markingId }) => markingId !== id),
          }));

          return {
            ...data,
            pages: newPages,
          };
        },
      );
    },
  });
};
