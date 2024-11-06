import { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/widgets/marking/ui";
import { useGetMyActivityMarkingList } from "@/entities/marking/hooks";
import { useInfiniteScroll } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MarkingList } from "./markingList";

export const MyActivityList = () => {
  const map = useMap();
  const token = useAuthStore((state) => state.token);

  const [activeTab, setActiveTab] = useState<"LIKED" | "SAVED">("LIKED");

  const {
    data: markingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyActivityMarkingList(activeTab);

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // todo token이 null일 때 view 처리
  if (token === null) {
    return null;
  }

  return (
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
            // todo isFollowing 삭제
            isFollowing={false}
            {...marking}
          />
        ))}
      </MarkingList>
      <div className="h-[.125rem]" ref={setNode} />
    </div>
  );
};
