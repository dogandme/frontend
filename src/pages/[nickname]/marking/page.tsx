import { useLocation } from "react-router-dom";
import { MarkingList } from "@/widgets/map/ui/markingList";
import { useMapQueryParams } from "@/features/map/hooks";
import { MarkingItem, SortTypeFilter } from "@/features/marking/ui";
import {
  useGetMarkingDetail,
  useGetUserMarkingList,
} from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetMyFollowingIdsMap, useGetProfile } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const UserMarkingPage = () => {
  const { state } = useLocation() as { state: null | { markingId: number } };

  const markingId = state?.markingId;
  const { nicknameParams } = useNicknameParams();
  const { sortTypeParam, boundsParams } = useMapQueryParams();

  const { nickname: myNickname, token } = useAuthStore.getState();

  const { data: myFollowingIdsMap } = useGetMyFollowingIdsMap();
  const { data: profile } = useGetProfile({ nickname: myNickname });
  const { data: clickedMarking } = useGetMarkingDetail({ markingId });
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

  // todo 회원이 아닐 경우
  if (!token || !myFollowingIdsMap) return null;

  return (
    <div className="px-4">
      <BackwardNavigationBar
        label={
          <h1 className="title-1 text-grey-900 py-4">
            {nicknameParams === myNickname ? "내" : nicknameParams} 마킹
          </h1>
        }
      />

      <section className="pb-4 flex flex-col gap-4">
        {nicknameParams === myNickname &&
          typeof profile?.tempCnt === "number" &&
          profile.tempCnt > 0 && (
            <div className="pt-4">
              <TemporaryMarkingBar tempCnt={profile.tempCnt} />
            </div>
          )}

        {clickedMarking && (
          <>
            <MarkingItem
              {...clickedMarking}
              onRegionClick={() => {
                // todo 맵 페이지로 이동
              }}
              // todo 수정하기
              isFollowing={false}
              isLiked={false}
              isBookmarked={false}
            />
            <DividerLine axis="row" />
          </>
        )}

        <div className="flex w-full justify-end">
          <SortTypeFilter
            options={["RECENT", "POPULARITY"]}
            defaultOptionIdx={0}
          />
        </div>

        <MarkingList display="list">
          {markingList?.map((marking) => {
            if (marking.markingId === markingId) return;

            return (
              <MarkingItem
                key={marking.markingId}
                onRegionClick={() => {
                  // todo 맵 페이지로 이동
                }}
                // todo isLiked, isBookmarked 설정
                isLiked={false}
                isBookmarked={false}
                isFollowing={myFollowingIdsMap[marking.userId]}
                {...marking}
              />
            );
          })}
        </MarkingList>
        <div className="h-[.125rem]" ref={setNode} />
      </section>
    </div>
  );
};
