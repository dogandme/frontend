import { Link } from "react-router-dom";
import { useGetDashboardMarkingThumbnail } from "@/entities/marking/api";
import {
  EmptyMarkingThumbnailGrid,
  EmptyMyMarkingThumbnailGrid,
} from "@/entities/marking/ui";
import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import { useInfiniteScroll, useNicknameParams } from "@/shared/lib";

interface MarkingThumbnailGridProps {
  nickname: Nickname;
}
export const MarkingThumbnailGrid = ({
  nickname,
}: MarkingThumbnailGridProps) => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useGetDashboardMarkingThumbnail(nickname);

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const { nicknameParams, isMyPage } = useNicknameParams();

  if (!data || isLoading) {
    return <div>loading..</div>;
  }

  if (data.length === 0) {
    return isMyPage ? (
      <EmptyMyMarkingThumbnailGrid />
    ) : (
      <EmptyMarkingThumbnailGrid />
    );
  }

  return (
    <section className="w-full grid grid-cols-3 gap-2">
      {data.map(({ markingId, previewImage }) => (
        <Link
          to={`/@${nicknameParams}/markings`}
          key={markingId}
          className="aspect-square"
          state={{ markingId }}
        >
          <img
            src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
            alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
            className="w-full h-full object-cover rounded-[1rem]"
          />
        </Link>
      ))}
      <div ref={setNode} />
    </section>
  );
};
