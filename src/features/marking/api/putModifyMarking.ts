import { useLocation } from "react-router-dom";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { GetMarkingListResponse } from "@/entities/marking/api";
import type {
  TempMarking,
  MarkingImage,
  Marker,
} from "@/entities/marking/types/server";
import { ROUTER_PATH } from "@/shared/constants";
import { apiClient } from "@/shared/lib";
import { MARKING_END_POINT } from "../constants";

export interface PutModifyMarkingRequest
  extends Pick<TempMarking, "isVisible"> {
  content: NonNullable<TempMarking["content"]>;
  id: TempMarking["markingId"];
  removeIds: MarkingImage["id"][];
  isTempSaved: boolean;
  images: File[];
}

type ModifyMarkingEndPoint = Extract<
  keyof typeof MARKING_END_POINT,
  "PUT_MODIFY_TEMP_MARKING" | "PUT_MODIFY_MARKING"
>;

type InvalidateQueryKey = "marker" | "markingList";

export interface UsePutModifyMarkingParams {
  endPoint: ModifyMarkingEndPoint;
  queryKeys: InvalidateQueryKey[];
}

export const usePutModifyMarking = ({
  endPoint,
  queryKeys,
}: UsePutModifyMarkingParams) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

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
      queryKeys.forEach((queryKey) => {
        // 임시저장 페이지에서 저장 할 경우엔 임시저장 리스트에서 해당 마킹 아이템 제거
        if (!isTempSaved && pathname === ROUTER_PATH.TEMPORARY_MARKING) {
          queryClient.setQueriesData<InfiniteData<GetMarkingListResponse>>(
            { queryKey: [queryKey] },
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

        if (isTempSaved && queryKey === "markingList") {
          queryClient.setQueriesData<InfiniteData<GetMarkingListResponse>>(
            { queryKey: [queryKey] },
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

        if (isTempSaved && queryKey === "marker") {
          queryClient.setQueriesData<Marker[]>(
            {
              queryKey: [queryKey],
            },
            (data) => {
              if (!data) {
                return data;
              }
              return data.filter(({ markingId }) => markingId !== id);
            },
          );
        }

        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
    },
  });
};
