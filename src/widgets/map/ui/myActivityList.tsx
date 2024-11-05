import { useMap } from "@vis.gl/react-google-maps";
import { MarkingItem } from "@/features/marking/ui";
import { useGetMyLikedMarkingList } from "@/entities/marking/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { MarkingList } from "./markingList";

export const MyActivityList = () => {
  const map = useMap();
  const token = useAuthStore((state) => state.token);

  const {
    data: myLikedMarkingList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyLikedMarkingList();

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
        <button type="button" className="title-1 text-grey-900">
          좋아요
        </button>
        <button type="button" className="title-1 text-grey-300">
          저장됨
        </button>
      </div>

      <MarkingList display="list">
        {myLikedMarkingList?.map((marking) => (
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
    </div>
  );
};
