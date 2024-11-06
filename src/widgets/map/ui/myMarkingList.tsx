import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import { useGetUserMarkingList } from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetProfile } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MarkingList } from "./markingList";

export const MyMarkingList = () => {
  const map = useMap();

  const { sortTypeParam, boundsParams } = useMapQueryParams();

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

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

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
          />
        </div>

        <MarkingList display="list">
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
              // todo isLiked, isBookmarked, isFollowing 설정
              isLiked={false}
              isBookmarked={false}
              isFollowing={false}
              {...marking}
            />
          ))}
        </MarkingList>
        <div className="h-[.125rem]" ref={setNode} />
      </section>
    </div>
  );
};
