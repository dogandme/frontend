import { skipToken, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, formatDateToYearMonthDay } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MY_MARKING_END_POINT } from "../constants";
import { markingQueryKey } from "./queryKey";
import type { TempMarking } from "./type";

export interface GetTemporaryMarkingListResponse {
  markings: TempMarking[];
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

export const useGetTemporaryMarkingList = () => {
  const token = useAuthStore((state) => state.token);
  return useInfiniteQuery({
    queryKey: markingQueryKey.myTemporaryMarkingList(),
    queryFn: token
      ? ({ pageParam }) =>
          apiClient.get<GetTemporaryMarkingListResponse>(
            MY_MARKING_END_POINT.TEMPORARY(pageParam),
            {
              withToken: true,
            },
          )
      : skipToken,
    getNextPageParam: ({ totalPages, pageAble }) => {
      return pageAble.pageNumber < totalPages - 1
        ? pageAble.pageNumber + 1
        : null;
    },
    initialPageParam: 0,
    /**
     * 페이징 된 데이터를 하나의 객체로 만든 후 엔트리 형태로 변환하여 반환 합니다.
     * [날짜 , TemporaryMarking[]] 형태로 반환 합니다.
     */
    select: ({ pages }) => {
      const markings = pages.flatMap((page) => page.markings);
      const temporaryMarkingMap = markings.reduce<
        Record<string, TempMarking[]>
      >((map, { regDt, ...rest }) => {
        const key = formatDateToYearMonthDay(regDt);

        if (!map[key]) {
          map[key] = [];
        }
        map[key] = [...map[key], { regDt, ...rest }].sort(
          (a, b) => new Date(b.regDt).getTime() - new Date(a.regDt).getTime(),
        );
        return map;
      }, {});

      return Object.entries(temporaryMarkingMap);
    },
  });
};
