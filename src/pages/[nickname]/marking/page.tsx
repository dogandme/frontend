import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MarkingList } from "@/widgets/map/ui/markingList";
import { MarkingItem } from "@/widgets/marking/ui";
import { SortTypeFilter } from "@/features/marking/ui";
import {
  SortType,
  useGetAllMarkingsOfUser,
  useGetMarkingDetail,
} from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import {
  useGetMyBookmarkIdsMap,
  useGetMyFollowingIdsMap,
  useGetMyLikedIdsMap,
  useGetProfile,
} from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const UserMarkingPage = () => {
  const { state } = useLocation() as { state: null | { markingId: number } };

  const sortTypeOptions: Exclude<SortType, "DISTANCE">[] = [
    "RECENT",
    "POPULARITY",
  ];
  const [selectedSortType, setSelectedSortType] = useState<
    Exclude<SortType, "DISTANCE">
  >(sortTypeOptions[0]);

  const markingId = state?.markingId;
  const { nicknameParams } = useNicknameParams();

  const { nickname: myNickname, token } = useAuthStore.getState();

  const { data: myBookmarkIdsMap } = useGetMyBookmarkIdsMap();
  const { data: myLikedIdsMap } = useGetMyLikedIdsMap();
  const { data: myFollowingIdsMap } = useGetMyFollowingIdsMap();
  const { data: profile } = useGetProfile({ nickname: myNickname });
  const { data: clickedMarking } = useGetMarkingDetail({ markingId });
  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllMarkingsOfUser({
    nickname: nicknameParams,
    sortType: selectedSortType,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // todo ui 표시
  if (!token || !myFollowingIdsMap || !myBookmarkIdsMap || !myLikedIdsMap)
    return null;

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
              isFollowing={myFollowingIdsMap[clickedMarking.userId]}
              isLiked={myLikedIdsMap[clickedMarking.markingId]}
              isBookmarked={myBookmarkIdsMap[clickedMarking.markingId]}
            />
            <DividerLine axis="row" />
          </>
        )}

        <div className="flex w-full justify-end">
          <SortTypeFilter
            options={sortTypeOptions}
            selectedOption={selectedSortType}
            onSelect={(sortType) => {
              setSelectedSortType(sortType as Exclude<SortType, "DISTANCE">);
            }}
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
                isLiked={myLikedIdsMap[marking.markingId]}
                isBookmarked={myBookmarkIdsMap[marking.markingId]}
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
