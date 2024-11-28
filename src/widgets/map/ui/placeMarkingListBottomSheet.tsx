import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem, MarkingItemSkeleton } from "@/widgets/marking/ui";
import {
  Bounds,
  useMapQueryParams,
  usePlaceQueryParams,
} from "@/features/map/hooks";
import { SortTypeFilter } from "@/features/marking/ui";
import { LatLng } from "@/entities/auth/api";
import {
  SortType,
  useGetMarkingDetail,
  useGetMarkingList,
} from "@/entities/marking/api";
import { EmptyMarkingThumbnailGrid } from "@/entities/marking/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";
import { mapOptions } from "../constants";
import { MarkingList } from "./markingList";

export const PlaceMarkingListBottomSheet = () => {
  const { boundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const { boundsAdjacentPlace } = usePlaceQueryParams();
  const sortTypeOption = ["POPULARITY", "RECENT"] as const;
  const navigate = useNavigate();

  return (
    <>
      <BackwardNavigationBar
        onClick={() => {
          navigate(ROUTER_PATH.MAP);
          setMapQueryParams({
            bounds: boundsParams,
            sortType: "POPULARITY",
          });
        }}
      >
        이 장소 관련 마킹
      </BackwardNavigationBar>
      <div className="flex justify-end w-full px-4 mb-4">
        <SortTypeFilter
          options={sortTypeOption}
          selectedOption={sortTypeParam || sortTypeOption[0]}
          onSelect={(sortType) => {
            setMapQueryParams({ sortType });
          }}
        />
      </div>
      <PlaceMarkingList
        sortType={sortTypeParam || "POPULARITY"}
        boundsParams={boundsAdjacentPlace}
      />
    </>
  );
};

interface PlaceMarkingListProps {
  sortType: SortType;
  boundsParams: Bounds;
}
const PlaceMarkingList = ({
  sortType,
  boundsParams,
}: PlaceMarkingListProps) => {
  const location = useLocation();

  const { state } = location;

  const {
    data: markingList = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMarkingListLoading,
  } = useGetMarkingList({
    ...boundsParams,
    sortType,
    searchType: "LOCATION",
    filterData: (data) => data.markingId !== state?.markingInfo?.markingId,
  });

  const { data: clickedMarking, isLoading: isClickedMarkingLoading } =
    useGetMarkingDetail({
      markingId: state?.markingInfo?.markingId,
    });

  const queryClient = useQueryClient();
  const map = useMap();

  const handleRegionClick = ({ lat, lng }: LatLng) => {
    map.setCenter({
      lat,
      lng,
    });
    map.setZoom(mapOptions.maxZoom);
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: ["markingList"],
    });
  };

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isMarkingListLoading || isClickedMarkingLoading) {
    return (
      <MarkingList display="list" className="px-4">
        {state?.markingInfo?.markingId && (
          <>
            <MarkingItemSkeleton />
            <DividerLine axis="row" />
          </>
        )}
        {Array.from({ length: 5 }, (_, idx) => idx).map((key) => (
          <MarkingItemSkeleton key={key} />
        ))}
      </MarkingList>
    );
  }

  return (
    <>
      <MarkingList display="list" className="px-4">
        {/* 특정 유저 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
        {clickedMarking && (
          <>
            <MarkingItem
              {...clickedMarking}
              onDelete={handleDelete}
              onRegionClick={handleRegionClick}
              queryKeys={["marker", "markingList"]}
            />
            {markingList.length > 0 && <DividerLine axis="row" />}
          </>
        )}
        {markingList.length === 0 && !clickedMarking && (
          <EmptyMarkingThumbnailGrid />
        )}
        {markingList.map((marking) => (
          <MarkingItem
            {...marking}
            onDelete={handleDelete}
            onRegionClick={handleRegionClick}
            queryKeys={["marker", "markingList"]}
          />
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
