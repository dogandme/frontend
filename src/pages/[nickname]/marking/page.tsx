import { useLocation, useNavigate } from "react-router-dom";
import { MarkingList } from "@/widgets/map/ui/markingList";
import { MarkingItem } from "@/widgets/marking/ui";
import { useMapQueryParams } from "@/features/map/hooks";
import { SortTypeFilter } from "@/features/marking/ui";
import {
  type Marking,
  type SortType,
  useGetAllMarkingsOfUser,
  useGetMarkingDetail,
} from "@/entities/marking/api";
import { TemporaryMarkingBar } from "@/entities/marking/ui";
import {
  EmptyMarkingThumbnailGrid,
  EmptyMyMarkingThumbnailGrid,
} from "@/entities/marking/ui";
import { useGetProfile, Nickname } from "@/entities/profile/api";
import { ROUTER_PATH } from "@/shared/constants";
import { useInfiniteScroll, withAuth } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib";
import { DividerLine } from "@/shared/ui/divider";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

export const UserMarkingPage = withAuth(() => {
  const { nicknameParams, isMyPage } = useNicknameParams();

  const { sortTypeParam, setMapQueryParams } = useMapQueryParams();
  const sortTypeOption = ["RECENT", "POPULARITY"] as const;

  const { data: profile } = useGetProfile({ nickname: nicknameParams });

  return (
    <div className="px-4">
      <BackwardNavigationBar>
        {`${isMyPage ? "내" : nicknameParams} 마킹`}
      </BackwardNavigationBar>
      <section className="pb-4 flex flex-col gap-4">
        {isMyPage &&
          typeof profile?.tempCnt === "number" &&
          profile.tempCnt > 0 && (
            <div className="pt-4">
              <TemporaryMarkingBar tempCnt={profile.tempCnt} />
            </div>
          )}
        <div className="flex w-full justify-end">
          <SortTypeFilter
            options={sortTypeOption}
            selectedOption={sortTypeParam || sortTypeOption[0]}
            onSelect={(sortType) => {
              setMapQueryParams({ sortType });
            }}
          />
        </div>
        <MyMarkingList
          nickname={nicknameParams}
          isMyPage={isMyPage}
          sortType={
            (sortTypeParam || "RECENT") as (typeof sortTypeOption)[number]
          }
        />
      </section>
    </div>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);

interface MyMarkingListProps {
  nickname: Nickname;
  isMyPage: boolean;
  sortType: Exclude<SortType, "DISTANCE">;
}
const MyMarkingList = ({
  nickname,
  isMyPage,
  sortType,
}: MyMarkingListProps) => {
  const { state } = useLocation() as { state: null | { markingId: number } };
  const navigate = useNavigate();

  const { data: clickedMarking, isLoading: isClickedMarkingLoading } =
    useGetMarkingDetail({
      markingId: state?.markingId,
    });

  const {
    data: markingList = [],
    isLoading: isMarkingListLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllMarkingsOfUser({
    nickname,
    sortType,
    filterData: (data) => data.markingId !== state?.markingId,
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

  if (isMarkingListLoading || isClickedMarkingLoading) {
    return <div>loading..</div>;
  }

  return (
    <>
      <MarkingList display="list">
        {/* 내 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
        {clickedMarking && (
          <>
            <MarkingItem
              onRegionClick={handleRegionClick}
              {...clickedMarking}
            />
            {markingList.length > 0 && <DividerLine axis="row" />}
          </>
        )}
        {markingList.length === 0 &&
          !clickedMarking &&
          (isMyPage ? (
            <EmptyMyMarkingThumbnailGrid />
          ) : (
            <EmptyMarkingThumbnailGrid />
          ))}
        {markingList.map((marking) => (
          <MarkingItem
            key={marking.markingId}
            onRegionClick={handleRegionClick}
            {...marking}
          />
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
