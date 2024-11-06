import { useLocation } from "react-router-dom";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Marking,
  TempMarkingFileInfo,
  TempMarkingInfo,
} from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
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

type InvalidateQueryKey = "marker" | "markingList";

export interface PutModifyMarkingArguments {
  endPoint: ModifyMarkingEndPoint;
  queryKeys: InvalidateQueryKey[];
}

// TODO : 타입 리팩토링 시 해당 타입을 기본적인 타입으로 한 후 다른 타입들을 확장 시켜 리팩토링
interface MarkingListResponse {
  markings: Marking[];
  totalElements: number;
  totalPages: number;
  pageAble: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface MarkerListResponse {
  markingId: number;
  lat: number;
  lng: number;
  previewImage: string;
}

export const usePutModifyMarking = ({
  endPoint,
  queryKeys,
}: PutModifyMarkingArguments) => {
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
          queryClient.setQueriesData<InfiniteData<MarkingListResponse>>(
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
          queryClient.setQueriesData<InfiniteData<MarkingListResponse>>(
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
          queryClient.setQueriesData<MarkerListResponse[]>(
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
