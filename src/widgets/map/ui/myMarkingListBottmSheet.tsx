import { useLocation } from "react-router-dom";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { Bounds, useMapQueryParams } from "@/features/map/hooks";
import { RangeFilter, SortTypeFilter } from "@/features/marking/ui";
import { LatLng } from "@/entities/auth/api";
import {
  useGetMarkingDetail,
  useGetUserMarkingList,
} from "@/entities/marking/api";
import { SortType } from "@/entities/marking/api";
import {
  EmptyMyMarkingThumbnailGrid,
  TemporaryMarkingBar,
} from "@/entities/marking/ui";
import { Nickname, useGetProfile } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { DividerLine } from "@/shared/ui/divider";
import { mapOptions } from "../constants";
import { MarkingList } from "./markingList";

export const MyMarkingListBottomSheet = () => {
  const nickname = useAuthStore.getState().nickname;
  const { data: profile } = useGetProfile({ nickname });
  const { sortTypeParam, setMapQueryParams, boundsParams } =
    useMapQueryParams();
  const sortTypeOption = ["RECENT", "POPULARITY", "DISTANCE"] as const;

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
            options={sortTypeOption}
            selectedOption={
              (sortTypeParam || "RECENT") as (typeof sortTypeOption)[number]
            }
            onSelect={(sortType) => {
              setMapQueryParams({ sortType });
            }}
          />
        </div>
        <MyMarkingList
          nickname={nickname}
          sortType={sortTypeParam || "RECENT"}
          boundsParams={boundsParams}
        />
      </section>
    </div>
  );
};

interface MyMarkingListProps {
  nickname: Nickname;
  sortType: SortType;
  boundsParams: Bounds;
}
const MyMarkingList = ({
  nickname,
  sortType,
  boundsParams,
}: MyMarkingListProps) => {
  const map = useMap();
  const { state } = useLocation();
  const { data: clickedMarking, isLoading: isClickedMarkingLoading } =
    useGetMarkingDetail({
      markingId: state?.markingInfo?.markingId,
    });

  const {
    data: markingList = [],
    isLoading: isMarkingListLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserMarkingList({
    ...boundsParams,
    nickname: nickname || "",
    sortType,
    filterData: (data) => data.markingId !== state?.markingInfo?.markingId,
  });

  const handleRegionClick = ({ lat, lng }: LatLng) => {
    map.setCenter({
      lat,
      lng,
    });
    map.setZoom(mapOptions.maxZoom);
  };

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isMarkingListLoading || isClickedMarkingLoading) {
    return <div>loading..</div>;
  }

  return (
    <>
      <MarkingList display="list">
        {/* 내 마킹 페이지에서 특정 마커를 클릭한 경우 나타나는 마킹 아이템 */}
        {clickedMarking && (
          <MarkingItem onRegionClick={handleRegionClick} {...clickedMarking} />
        )}
        {clickedMarking && markingList.length > 0 && <DividerLine axis="row" />}
        {markingList.length === 0 && !clickedMarking ? (
          <EmptyMyMarkingThumbnailGrid />
        ) : (
          markingList.map((marking) => (
            <MarkingItem
              key={marking.markingId}
              onRegionClick={handleRegionClick}
              {...marking}
            />
          ))
        )}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
