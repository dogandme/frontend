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
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetDashboardMarkingThumbnail(nickname);

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const { nicknameParams, isMyPage } = useNicknameParams();

  if (!data) {
    return <MarkingThumbnailGridSkeleton />;
  }

  if (data.length === 0) {
    return isMyPage ? (
      <EmptyMyMarkingThumbnailGrid />
    ) : (
      <EmptyMarkingThumbnailGrid />
    );
  }

  const thumbnailList = data.map(({ markingId, previewImage }) => ({
    src: `${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`,
    markingId,
  }));

  return (
    <section className="w-full grid grid-cols-3 gap-2">
      <MarkingThumbnailGridImages
        thumbnailList={thumbnailList}
        nickname={nicknameParams}
      />
      <div ref={setNode} />
    </section>
  );
};

interface MarkingThumbnailGridImagesProps {
  thumbnailList: (Pick<Marking, "markingId"> & {
    src: string;
  })[];
  nickname: string;
}

const MarkingThumbnailGridImages = ({
  thumbnailList,
  nickname,
}: MarkingThumbnailGridImagesProps) => {
  const { isLoading, getImageCache } = useImageState(thumbnailList);

  if (isLoading) {
    return thumbnailList.map((_, idx) => (
      <div key={idx} className="aspect-square skeleton  rounded-[1rem]" />
    ));
  }

  return thumbnailList.map(({ markingId, src }) => {
    const { isSuccess } = getImageCache(src);
    return (
      <Link
        to={`/@${nickname}/markings`}
        key={markingId}
        className="aspect-square"
        state={{ markingId }}
      >
        <img
          src={isSuccess ? src : "/default-image.png"}
          alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
          className="w-full h-full object-cover rounded-[1rem]"
        />
      </Link>
    );
  });
};

export const MarkingThumbnailGridSkeleton = () => (
  <section className="w-full grid grid-cols-3 gap-2">
    {Array.from({ length: 20 }, (_, idx) => idx).map((key) => (
      <div key={key} className="aspect-square skeleton  rounded-[1rem]" />
    ))}
  </section>
);
