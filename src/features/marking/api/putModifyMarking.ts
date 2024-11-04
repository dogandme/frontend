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

export interface PutModifyMarkingRequest
  extends Pick<TempMarkingInfo, "isVisible"> {
  content: NonNullable<TempMarkingInfo["content"]>;
  id: TempMarkingInfo["markingId"];
  removeIds: TempMarkingFileInfo["id"][];
  isTempSaved: boolean;
  images: File[];
}

type ModifyMarkingEndPoint = Extract<
  keyof typeof MARKING_END_POINT,
  "PUT_MODIFY_TEMP_MARKING" | "PUT_MODIFY_MARKING"
>;
type InvalidateQueryKey = "temporaryMarkingList"[] | "myMarkerList"[];

export interface PutModifyMarkingArguments {
  endPoint: ModifyMarkingEndPoint;
  queryKey: InvalidateQueryKey;
}

export const usePutModifyMarking = ({
  endPoint,
  queryKey,
}: PutModifyMarkingArguments) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, PutModifyMarkingRequest>({
    mutationKey: ["markingFormModal"],
    mutationFn: ({ images, ...formObj }: PutModifyMarkingRequest) => {
      const formData = new FormData();
      formData.append(
        "markingModifyDto",
        new Blob([JSON.stringify(formObj)], { type: "application/json" }),
      );
      images.forEach((image) => {
        formData.append("images", image);
      });
      return apiClient.put(MARKING_END_POINT[endPoint], {
        withToken: true,
        body: formData,
      });
    },

    onSuccess: (_data, { isTempSaved, id }) => {
      if (!isTempSaved) {
        queryClient.setQueryData<InfiniteData<GetTemporaryMarkingListResponse>>(
          queryKey,
          (data) => {
            if (!data) {
              return data;
            }
            const { pages } = data;
            const newPages = pages.map((page) => ({
              ...page,
              markings: page.markings.filter(
                ({ markingId }) => markingId !== id,
              ),
            }));

            return {
              ...data,
              pages: newPages,
            };
          },
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["temporaryMarkingList"],
      });
    },
  });
};
