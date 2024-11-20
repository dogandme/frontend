import { useLocation } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import { LatLng } from "@/entities/auth/api";
import {
  useGetMarkingDetail,
  useGetUserMarkingList,
} from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import {
  useGetMyBookmarkIdsMap,
  useGetMyLikedIdsMap,
  useGetProfile,
} from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { MarkingList } from "./markingList";

export const MyMarkingList = () => {
  const { state } = useLocation();

  const map = useMap();

  const { sortTypeParam, boundsParams, setMapQueryParams } =
    useMapQueryParams();

  const nickname = useAuthStore.getState().nickname;

  const { data: profile } = useGetProfile({ nickname });
  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserMarkingList({
    ...boundsParams,
    nickname: nickname || "",
    sortType: sortTypeParam,
  });
  const { data: myBookmarkIdsMap = {} } = useGetMyBookmarkIdsMap();
  const { data: myLikedIdsMap = {} } = useGetMyLikedIdsMap();
  const { data: clickedMarking } = useGetMarkingDetail({
    markingId: state?.markingInfo?.markingId,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleRegionClick = ({ lat, lng }: LatLng) => {
    map.setCenter({
      lat,
      lng,
    });
    map.setZoom(19);
  };

  // todo 회원이 아닐 경우
  if (!nickname) return null;

  return (
    <div className="px-4">
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">내 마킹</h1>

      <section className="pb-4 flex flex-col gap-4">
        {typeof profile?.tempCnt === "number" && profile.tempCnt > 0 && (
          <div className="pt-4">
            <TemporaryMarkingBar tempCnt={profile.tempCnt} />
          </div>
        )}

        <div className="flex w-full justify-end">
          <RangeFilter
            options={["ALL_VIEW", "CURRENT_LOCATION", "MAP_LOCATION"]}
          />
          <SortTypeFilter
            options={["RECENT", "POPULARITY", "DISTANCE"]}
            selectedOption={sortTypeParam || "RECENT"}
            onSelect={(sortType) => {
              setMapQueryParams({ sortType });
            }}
          />
        </div>

        <MarkingList display="list">
          {/* 내 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
          {clickedMarking && (
            <>
              <MarkingItem
                {...clickedMarking}
                onRegionClick={() =>
                  handleRegionClick({
                    lat: clickedMarking.lat,
                    lng: clickedMarking.lng,
                  })
                }
                isLiked={myLikedIdsMap[clickedMarking.markingId]}
                isBookmarked={myBookmarkIdsMap[clickedMarking.markingId]}
              />
              <DividerLine axis="row" />
            </>
          )}
          {markingList?.map((marking) => (
            <MarkingItem
              key={marking.markingId}
              onRegionClick={() =>
                handleRegionClick({ lat: marking.lat, lng: marking.lng })
              }
              isLiked={myLikedIdsMap[marking.markingId]}
              isBookmarked={myBookmarkIdsMap[marking.markingId]}
              queryKeys={["marker", "markingList"]}
              {...marking}
            />
          ))}
        </MarkingList>
        <div className="h-[.125rem]" ref={setNode} />
      </section>
    </div>
  );
};
