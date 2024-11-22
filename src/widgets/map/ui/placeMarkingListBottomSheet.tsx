import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { useMapQueryParams, usePlaceQueryParams } from "@/features/map/hooks";
import { SortTypeFilter } from "@/features/marking/ui";
import { LatLng } from "@/entities/auth/api";
import {
  type Marking,
  useGetMarkingDetail,
  useGetMarkingList,
} from "@/entities/marking/api";
import {
  useGetMyFollowingIdsMap,
  useGetMyBookmarkIdsMap,
  useGetMyLikedIdsMap,
} from "@/entities/profile/api";
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
      <PlaceMarkingSelect />
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

const PlaceMarkingSelect = () => {
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

const PlaceMarkingItem = (marking: Marking) => {
  const map = useMap();

  const { data: myBookmarkIdsMap = {} } = useGetMyBookmarkIdsMap();
  const { data: myLikedIdsMap = {} } = useGetMyLikedIdsMap();

  const handleRegionClick = async ({ lat, lng }: LatLng) => {
    await map.setCenter({
      lat,
      lng,
    });
    await map.setZoom(mapOptions.maxZoom);
  };

  return (
    <MarkingItem
      {...marking}
      onRegionClick={() =>
        handleRegionClick({
          lat: marking.lat,
          lng: marking.lng,
        })
      }
      isLiked={myLikedIdsMap[marking.markingId]}
      isBookmarked={myBookmarkIdsMap[marking.markingId]}
    />
  );
};

const PlaceMarkingList = () => {
  const location = useLocation();

  const { state } = location;

  const { sortTypeParam } = useMapQueryParams();
  const { boundsAdjacentPlace } = usePlaceQueryParams();

  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingList({
    ...boundsAdjacentPlace,
    sortType: sortTypeParam,
    searchType: "LOCATION",
  });
  const { data: clickedMarking } = useGetMarkingDetail({
    markingId: state?.markingInfo?.markingId,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });


  return (
    <>
      <MarkingList display="list" className="px-4">
        {/* 내 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
        {clickedMarking && <PlaceMarkingItem {...clickedMarking} />}
        <DividerLine axis="row" />
        {markingList?.map((marking) =>
          marking.markingId === clickedMarking?.markingId ? null : (
            <PlaceMarkingItem {...marking} />
          ),
        )}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
