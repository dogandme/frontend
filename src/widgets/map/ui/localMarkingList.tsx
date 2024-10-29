import { useResearchMarkingList } from "@/features/map/hooks";
import { MapViewModeFilter, SortTypeFilter } from "@/features/marking/ui";
import { useGetMarkingList } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { MyLocationIcon } from "@/shared/ui/icon";
import { MarkingList } from "./markingList";

export const LocalMarkingList = () => {
  const { bounds, sortType } = useResearchMarkingList();
  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMarkingList({
    southWestLat: bounds?.southWest.lat,
    southWestLng: bounds?.southWest.lng,
    northEastLat: bounds?.northEast.lat,
    northEastLng: bounds?.northEast.lng,
    sortType,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
      <h1 className="title-1 text-grey-900 py-4">동네 마킹</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 text-tangerine-500 items-center">
          <MyLocationIcon width={20} height={20} />
          <span className="body-2 text-grey-500">영등포 1동 주변</span>
        </div>

        <div className="flex">
          <MapViewModeFilter options={["CURRENT_LOCATION", "MAP_LOCATION"]} />
          <SortTypeFilter options={["POPULARITY", "RECENT", "DISTANCE"]} />
        </div>
      </div>
      <MarkingList display="grid">
        {markingList?.map(({ markingId, previewImage }) => (
          <button key={markingId} type="button" className="aspect-square">
            <img
              className="w-full h-full object-cover"
              src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
            />
          </button>
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </>
  );
};
