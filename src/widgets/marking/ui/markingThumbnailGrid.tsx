import { Link } from "react-router-dom";
import { useGetDashboardMarkingThumbnail } from "@/entities/marking/api";
import {
  EmptyMarkingThumbnailGrid,
  EmptyMyMarkingThumbnailGrid,
} from "@/entities/marking/ui";
import { useInfiniteScroll, useNicknameParams } from "@/shared/lib";
import { LoadingSpinner } from "@/shared/ui/spinner";

export const MarkingThumbnailGrid = ({ nickname }: { nickname: string }) => {
  const {
    data = [],
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetDashboardMarkingThumbnail({ nickname });

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
        {data.map(({ markingId, previewImage, previewImageIsSuccess }) => {
          return (
            <Link
              to={`/@${nickname}/markings`}
              key={markingId}
              className="aspect-square"
              state={{ markingId }}
            >
              <img
                src={previewImageIsSuccess ? previewImage : "/failed_image.svg"}
                alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
                className="w-full h-full object-cover rounded-[1rem]"
              />
            </Link>
          );
        })}
        {isFetchingNextPage && <LoadingSpinner />}
        <div ref={setNode} />
      </section>
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
