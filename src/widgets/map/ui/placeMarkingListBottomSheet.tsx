import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { useMapQueryParams, usePlaceQueryParams } from "@/features/map/hooks";
import { SortTypeFilter } from "@/features/marking/ui";
import {
  type Marking,
  useGetMarkingDetail,
  useGetMarkingList,
} from "@/entities/marking/api";
import { EmptyMarkingThumbnailGrid } from "@/entities/marking/ui";
import { useGetMyProfile } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";
import { mapOptions } from "../constants";
import { MarkingList } from "./markingList";

export const PlaceMarkingListBottomSheet = () => {
  return (
    <>
      <PlaceMarkingNavigationBar />
      <PlaceMarkingSortTypeFilter />
      <PlaceMarkingList />
    </>
  );
};

const PlaceMarkingNavigationBar = () => {
  const navigate = useNavigate();
  const { boundsParams, setMapQueryParams } = useMapQueryParams();

  return (
    <BackwardNavigationBar
      onClick={() => {
        navigate(ROUTER_PATH.MAP);
        setMapQueryParams({
          bounds: boundsParams,
          sortType: "POPULARITY",
        });
      }}
      label={<h1 className="text-grey-900 title-1">이 장소 관련 마킹</h1>}
    />
  );
};

const PlaceMarkingSortTypeFilter = () => {
  const { sortTypeParam, setMapQueryParams } = useMapQueryParams();

  return (
    <div className="flex justify-end w-full px-4 mb-4">
      <SortTypeFilter
        options={["POPULARITY", "RECENT"]}
        selectedOption={sortTypeParam || "POPULARITY"}
        onSelect={(sortType) => {
          setMapQueryParams({ sortType });
        }}
      />
    </div>
  );
};

interface PlaceMarkingItemProps {
  marking: Marking;
  isBookmarked: boolean;
  isLiked: boolean;
  isFollowing: boolean;
}

const PlaceMarkingItem = ({
  marking,
  isBookmarked,
  isLiked,
  isFollowing,
}: PlaceMarkingItemProps) => {
  const queryClient = useQueryClient();
  const map = useMap();

  return (
    <MarkingItem
      {...marking}
      onRegionClick={() => {
        map.setCenter({
          lat: marking.lat,
          lng: marking.lng,
        });
        map.setZoom(mapOptions.maxZoom);
      }}
      isLiked={isLiked}
      isBookmarked={isBookmarked}
      isFollowing={isFollowing}
      onDelete={() => {
        queryClient.invalidateQueries({
          queryKey: ["markingList"],
        });
      }}
      queryKeys={["marker", "markingList"]}
    />
  );
};

const PlaceMarkingList = () => {
  const location = useLocation();

  const { state } = location;

  const { sortTypeParam } = useMapQueryParams();
  const { boundsAdjacentPlace } = usePlaceQueryParams();

  const {
    data: markingList = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMarkingListLoading,
  } = useGetMarkingList({
    ...boundsAdjacentPlace,
    sortType: sortTypeParam,
    searchType: "LOCATION",
    filterData: (data) => data.markingId !== state?.markingInfo?.markingId,
  });

  const { data: clickedMarking, isLoading: isClickedMarkingLoading } =
    useGetMarkingDetail({
      markingId: state?.markingInfo?.markingId,
    });

  const { data: myProfile } = useGetMyProfile();

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isMarkingListLoading || isClickedMarkingLoading || !myProfile) {
    return <div className="px-4">loading..</div>;
  }

  return (
    <>
      <MarkingList display="list" className="px-4">
        {/* 특정 유저 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
        {clickedMarking && (
          <PlaceMarkingItem
            marking={clickedMarking}
            isBookmarked={myProfile.myBookmarkIdsMap[clickedMarking.markingId]}
            isLiked={myProfile.myLikedIdsMap[clickedMarking.markingId]}
            isFollowing={myProfile.myFollowingIdsMap[clickedMarking.markingId]}
          />
        )}
        {clickedMarking && markingList.length > 0 && <DividerLine axis="row" />}
        {markingList.length === 0 && !clickedMarking ? (
          <EmptyMarkingThumbnailGrid />
        ) : (
          markingList.map((marking) => (
            <PlaceMarkingItem
              key={marking.markingId}
              marking={marking}
              isBookmarked={myProfile.myBookmarkIdsMap[marking.markingId]}
              isLiked={myProfile.myLikedIdsMap[marking.markingId]}
              isFollowing={myProfile.myFollowingIdsMap[marking.markingId]}
            />
          ))
        )}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
