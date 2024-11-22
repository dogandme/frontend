import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MarkingList } from "@/widgets/map/ui/markingList";
import { MarkingItem } from "@/widgets/marking/ui";
import { SortTypeFilter } from "@/features/marking/ui";
import {
  type Marking,
  type SortType,
  useGetAllMarkingsOfUser,
  useGetMarkingDetail,
} from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import { useGetProfile, useGetMyProfile } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll, withAuth } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const UserMarkingPage = withAuth(() => {
  const { state } = useLocation() as { state: null | { markingId: number } };
  const navigate = useNavigate();

  const sortTypeOptions: Exclude<SortType, "DISTANCE">[] = [
    "RECENT",
    "POPULARITY",
  ];
  const [selectedSortType, setSelectedSortType] = useState<
    Exclude<SortType, "DISTANCE">
  >(sortTypeOptions[0]);

  const markingId = state?.markingId;
  const { nicknameParams, isMyPage } = useNicknameParams();

  const { nickname: myNickname, token } = useAuthStore.getState();

  const { data: myProfile } = useGetMyProfile();
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

  const handleRegionClick = ({
    markingId,
    lat,
    lng,
  }: Pick<Marking, "markingId" | "lat" | "lng">) => {
    navigate(isMyPage ? ROUTER_PATH.MY_MARK : ROUTER_PATH.PLACE, {
      state: {
        markingInfo: {
          position: {
            lat,
            lng,
          },
          markingId,
        },
      },
    });
  };

  // todo ui 표시
  if (!token) return null;

  // TODO 로딩 처리
  if (!myProfile) {
    return <div>내 정보를 가져오는 중...</div>;
  }

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
          {clickedMarking && (
            <>
              <MarkingItem
                {...clickedMarking}
                onRegionClick={() =>
                  handleRegionClick({
                    markingId: clickedMarking.markingId,
                    lat: clickedMarking.lat,
                    lng: clickedMarking.lng,
                  })
                }
                isFollowing={myProfile.myFollowingIdsMap[clickedMarking.userId]}
                isLiked={myProfile.myLikedIdsMap[clickedMarking.markingId]}
                isBookmarked={
                  myProfile.myBookmarkIdsMap[clickedMarking.markingId]
                }
              />
              <DividerLine axis="row" />
            </>
          )}
          {markingList?.map((marking) => {
            if (marking.markingId === markingId) return;

            return (
              <MarkingItem
                key={marking.markingId}
                onRegionClick={() =>
                  handleRegionClick({
                    markingId: marking.markingId,
                    lat: marking.lat,
                    lng: marking.lng,
                  })
                }
                isLiked={myProfile.myLikedIdsMap[marking.markingId]}
                isBookmarked={myProfile.myBookmarkIdsMap[marking.markingId]}
                isFollowing={myProfile.myFollowingIdsMap[marking.userId]}
                {...marking}
              />
            );
          })}
        </MarkingList>
        <div className="h-[.125rem]" ref={setNode} />
      </section>
    </div>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);
