import { Link } from "react-router-dom";
import {
  Marking,
  useGetDashboardMarkingThumbnail,
} from "@/entities/marking/api";
import {
  EmptyMarkingThumbnailGrid,
  EmptyMyMarkingThumbnailGrid,
} from "@/entities/marking/ui";
import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import {
  useImageState,
  useInfiniteScroll,
  useNicknameParams,
} from "@/shared/lib";

interface MarkingThumbnailGridProps {
  nickname: Nickname;
}
export const MarkingThumbnailGrid = ({
  nickname,
}: MarkingThumbnailGridProps) => {
  const {
    data = [],
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    imageState,
    makeMarkingImageSource,
  } = useGetDashboardMarkingThumbnail(nickname);

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const { isMyPage } = useNicknameParams();

  if (isLoading) {
    return <MarkingThumbnailGridSkeleton />;
  }

  if (data.length === 0) {
    return isMyPage ? (
      <EmptyMyMarkingThumbnailGrid />
    ) : (
      <EmptyMarkingThumbnailGrid />
    );
  }

  return (
    <>
      <section className="w-full grid grid-cols-3 gap-2">
        {data.map(({ markingId, previewImage }) => {
          const src = makeMarkingImageSource(markingId, previewImage);
          return (
            <Link
              to={`/@${nickname}/markings`}
              key={markingId}
              className="aspect-square"
              state={{ markingId }}
            >
              <img
                src={imageState[src].isSuccess ? src : "/default-image.png"}
                alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
                className="w-full h-full object-cover rounded-[1rem]"
              />
            </Link>
          );
        })}
        <div ref={setNode} />
      </section>
      {isFetchingNextPage && <div>TOOD 스피너로 변경하기</div>}
    </>
  );
};

export const MarkingThumbnailGridSkeleton = () => (
  <section className="w-full grid grid-cols-3 gap-2">
    {Array.from({ length: 20 }, (_, idx) => idx).map((key) => (
      <div key={key} className="aspect-square skeleton  rounded-[1rem]" />
    ))}
  </section>
);
