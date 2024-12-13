import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapQueryParams } from "@/features/map/hooks";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import type { Bounds } from "@/entities/map/types/client";
import {
  useGetAddressFromLatLng,
  useGetMarkingThumbnailList,
} from "@/entities/marking/api";
import type { Marking, SortType } from "@/entities/marking/types/server";
import { EmptyMarkingThumbnailGrid } from "@/entities/marking/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { MyLocationIcon } from "@/shared/ui/icon";
import { LoadingSpinner } from "@/shared/ui/spinner";
import { mapOptions } from "../constants";
import { MarkingList } from "./markingList";

export const LocalMarkingListBottomSheet = () => {
  const { boundsParams, setMapQueryParams, sortTypeParam } =
    useMapQueryParams();
  const sortTypeOptions = ["POPULARITY", "RECENT", "DISTANCE"] as const;

  return (
    <div className="px-4">
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">동네 마킹</h1>
      <div className="flex justify-between items-center mb-4">
        <LocalMarkingListBottomSheetHeader boundsParams={boundsParams} />
        <div className="flex">
          <RangeFilter options={["CURRENT_LOCATION", "MAP_LOCATION"]} />
          <SortTypeFilter
            options={sortTypeOptions}
            selectedOption={sortTypeParam || sortTypeOptions[0]}
            onSelect={(sortType) => {
              setMapQueryParams({ sortType });
            }}
          />
        </div>
      </div>
      <LocalMarkingList
        sortType={sortTypeParam || sortTypeOptions[0]}
        boundsParams={boundsParams}
      />
    </div>
  );
};

interface LocalMarkingListProps {
  sortType: SortType;
  boundsParams: Bounds;
}

const LocalMarkingList = ({
  sortType,
  boundsParams,
}: LocalMarkingListProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const map = useMap();

  const {
    data: markingThumbnailList = [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingThumbnailList({
    sortType,
    searchType: "NEARBY",
    lat: null,
    lng: null,
    ...boundsParams,
  });
  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // 동네 마킹에서 특정 썸네일을 클릭하면 해당 썸네일을 중심으로 하는 이 장소 마킹 페이지로 이동합니다.
  const handleClick = ({
    lat,
    lng,
    markingId,
  }: Pick<Marking, "lat" | "lng" | "markingId">) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("lat", lat.toString());
    searchParams.set("lng", lng.toString());
    searchParams.set("sortType", "POPULARITY");
    navigate(
      {
        pathname: ROUTER_PATH.PLACE,
        search: searchParams.toString(),
      },
      {
        state: {
          markingInfo: {
            position: {
              lat,
              lng,
            },
            markingId,
          },
        },
      },
    );
    map.setCenter({ lat, lng });
    map.setZoom(mapOptions.maxZoom);
  };

  if (isLoading) {
    return (
      <MarkingList display="grid">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div key={idx} className="aspect-square skeleton m-1" />
        ))}
      </MarkingList>
    );
  }

  return (
    <>
      {markingThumbnailList.length === 0 ? (
        <EmptyMarkingThumbnailGrid />
      ) : (
        <MarkingList display="grid">
          {markingThumbnailList.map(
            ({ lat, lng, markingId, previewImage, previewImageIsSuccess }) => {
              return (
                <button
                  key={markingId}
                  type="button"
                  className="aspect-square"
                  onClick={() => handleClick({ lat, lng, markingId })}
                >
                  <img
                    src={
                      previewImageIsSuccess ? previewImage : "failed_image.svg"
                    }
                    alt={`${markingId}번 마킹 이미지`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            },
          )}
        </MarkingList>
      )}
      {isFetchingNextPage && <LoadingSpinner />}
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};

interface LocalMarkingBottomSheetHeaderProps {
  boundsParams: Bounds;
}
const LocalMarkingListBottomSheetHeader = ({
  boundsParams,
}: LocalMarkingBottomSheetHeaderProps) => {
  const { northEastLat, northEastLng, southWestLat, southWestLng } =
    boundsParams;

  const lat =
    typeof northEastLat === "number" && typeof southWestLat === "number"
      ? (northEastLat + southWestLat) / 2
      : null;
  const lng =
    typeof northEastLng === "number" && typeof southWestLng === "number"
      ? (northEastLng + southWestLng) / 2
      : null;

  const { data } = useGetAddressFromLatLng({
    lat,
    lng,
  });

  // TODO 에러 처리 시 변경 하기
  if (data === undefined) {
    <div className="flex gap-1 text-tangerine-500 items-center">
      <MyLocationIcon width={20} height={20} />
      <span className="body-2 skeleton">loading loading loading</span>
    </div>;
  }

  return (
    <div className="flex gap-1 text-tangerine-500 items-center">
      <MyLocationIcon width={20} height={20} />
      <span className="body-2 text-grey-500">{data?.region}</span>
    </div>
  );
};
