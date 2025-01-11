import { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem, MarkingItemSkeleton } from "@/widgets/marking/ui";
import { MarkingPins } from "@/entities/map/ui";
import { useGetMyActivityMarkerList } from "@/entities/marking/api";
import { useGetMyActivityMarkingList } from "@/entities/marking/lib";
import { useInfiniteScroll, withAuth } from "@/shared/lib";
import { LoadingSpinner } from "@/shared/ui/spinner";
import { MarkingList } from "./markingList";

const MyActivityList = withAuth(() => {
  const map = useMap();

  const [activeTab, setActiveTab] = useState<"LIKED" | "SAVED">("LIKED");

  const {
    data: markingList,
    isLoading: isMarkingListLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyActivityMarkingList(activeTab);

  const { data: markerTiles } = useGetMyActivityMarkerList(activeTab);

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      {markerTiles && <MarkingPins tiles={markerTiles} />}
      <div className="px-4">
        <div className="p-4 flex gap-4">
          <button
            type="button"
            className={`title-1 ${activeTab === "LIKED" ? "text-grey-900" : "text-grey-300"}`}
            onClick={() => setActiveTab("LIKED")}
          >
            좋아요
          </button>
          <button
            type="button"
            className={`title-1 ${activeTab === "SAVED" ? "text-grey-900" : "text-grey-300"}`}
            onClick={() => setActiveTab("SAVED")}
          >
            저장됨
          </button>
        </div>

        <MarkingList display="list">
          {isMarkingListLoading
            ? Array.from({ length: 5 }, (_, idx) => idx).map((key) => (
                <MarkingItemSkeleton key={key} />
              ))
            : markingList?.map((marking) => (
                <MarkingItem
                  key={
                    import.meta.env.DEV
                      ? `${marking.markingId} ${activeTab}`
                      : marking.markingId
                  }
                  onRegionClick={() => {
                    map.setCenter({
                      lat: marking.lat,
                      lng: marking.lng,
                    });
                    map.setZoom(19);
                  }}
                  {...marking}
                />
              ))}
        </MarkingList>
        {isFetchingNextPage && <LoadingSpinner />}
        <div className="h-[.125rem]" ref={setNode} />
      </div>
    </>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);

export default MyActivityList;
