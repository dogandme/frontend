import { useNavigate } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { useGetMapCurrentBounds, useMapParams } from "@/features/map/hooks";
import { MarkingItem, SortTypeFilter } from "@/features/marking/ui";
import { useGetMarkingList } from "@/entities/marking/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";
import { MarkingList } from "./markingList";

export const PlaceMarkingList = () => {
  const navigate = useNavigate();
  const { boundsParams, sortTypeParam, setMapParams } = useMapParams();
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

  return (
    <>
      <BackwardNavigationBar
        onClick={() => {
          navigate(ROUTER_PATH.MAP);
          setMapParams({
            bounds: getMapBounds(),
            sortType: "POPULARITY",
          });
        }}
        label={<h1 className="text-grey-900 title-1">이 장소 관련 마킹</h1>}
      />

      <div className="flex justify-end w-full mb-4 px-4">
        <SortTypeFilter options={["POPULARITY", "RECENT"]} />
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
            // todo isLiked, isBookmarked 설정
            isLiked={false}
            isBookmarked={false}
            {...marking}
          />
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
