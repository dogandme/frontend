import { useMap } from "@vis.gl/react-google-maps";
import { useMapQueryParams } from "@/features/map/hooks";
import {
  MarkingItem,
  RangeFilter,
  SortTypeFilter,
} from "@/features/marking/ui";
import { useGetUserMarkingList } from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetProfile } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib/profile";
import { useAuthStore } from "@/shared/store";
import { MarkingList } from "./markingList";

export const UserMarkingList = () => {
  const map = useMap();
  const { nicknameParams } = useNicknameParams();

  const { sortTypeParam, boundsParams } = useMapQueryParams();

  const myNickname = useAuthStore.getState().nickname;

  const { data: profile } = useGetProfile({
    nickname: nicknameParams,
  });
  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserMarkingList({
    ...boundsParams,
    nickname: nicknameParams,
    sortType: sortTypeParam,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <div className="px-4">
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">
        {nicknameParams === myNickname ? "내 마킹" : `${nicknameParams}의 마킹`}
      </h1>

      <section className="pb-4 flex flex-col gap-4">
        {nicknameParams === myNickname &&
          typeof profile?.tempCnt === "number" &&
          profile.tempCnt > 0 && (
            <div className="pt-4">
              <TemporaryMarkingBar tempCnt={profile.tempCnt} />
            </div>
          )}

        <div className="flex w-full justify-end">
          <RangeFilter options={["CURRENT_LOCATION", "MAP_LOCATION"]} />
          <SortTypeFilter options={["POPULARITY", "RECENT", "DISTANCE"]} />
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
              // todo isLiked, isBookmarked 설정
              isLiked={false}
              isBookmarked={false}
              {...marking}
            />
          ))}
        </MarkingList>
        <div className="h-[.125rem]" ref={setNode} />
      </section>
    </div>
  );
};
