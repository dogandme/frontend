import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMap } from "@vis.gl/react-google-maps";
import {
  useGetMapCurrentBounds,
  useMapQueryParams,
} from "@/features/map/hooks";
import { MarkingItem, SortTypeFilter } from "@/features/marking/ui";
import { useGetMarkingList } from "@/entities/marking/api";
import { useGetMyFollowingIdsMap } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";
import { MarkingList } from "./markingList";

export const PlaceMarkingList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { boundsParams, sortTypeParam, setMapQueryParams } =
    useMapQueryParams();
  const { data: myFollowingMap } = useGetMyFollowingIdsMap();
  const getMapBounds = useGetMapCurrentBounds();

  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingList({
    ...boundsParams,
    sortType: sortTypeParam,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const map = useMap();

  // TODO 로딩 상태 구현 하기
  if (!markingList || !myFollowingMap) {
    return null;
  }

  return (
    <>
      <BackwardNavigationBar
        onClick={() => {
          navigate(ROUTER_PATH.MAP);
          setMapQueryParams({
            bounds: getMapBounds(),
            sortType: "POPULARITY",
          });
        }}
        label={<h1 className="text-grey-900 title-1">이 장소 관련 마킹</h1>}
      />

      <div className="flex justify-end w-full mb-4 px-4">
        <SortTypeFilter
          options={["POPULARITY", "RECENT"]}
          onSelect={(sortType) => {
            setMapQueryParams({ sortType });
          }}
        />
      </div>

      <MarkingList display="list" className="px-4">
        {markingList?.map((marking) => (
          <MarkingItem
            key={marking.markingId}
            onRegionClick={() => {
              map.setCenter({
                lat: marking.lat,
                lng: marking.lng,
              });
              map.setZoom(19);
            }}
            onDelete={() => {
              queryClient.invalidateQueries({
                queryKey: ["markingList"],
              });
            }}
            // todo isLiked, isBookmarked 설정
            isLiked={false}
            isBookmarked={false}
            isFollowing={myFollowingMap[marking.userId]}
            {...marking}
          />
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
