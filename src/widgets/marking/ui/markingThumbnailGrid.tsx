import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { useGetDashboardMarkingThumbnail } from "../api";

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

  if (!data) {
    return <div>loading..</div>;
  }

  if (data.length === 0) {
    return <EmptyMarkingThumbnailGrid />;
  }

  return (
    <section className="w-full grid grid-cols-3 gap-2">
      {data.map(({ markingId, previewImage }) => (
        // TODO : 이 장소 마킹 경로 나오면 Link 컴포넌트로 수정 하기
        <div key={markingId} className="aspect-square">
          <img
            src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
            alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
            className="w-full h-full object-cover rounded-[1rem]"
          />
        </div>
      ))}
      <div ref={setNode} />
    </section>
  );
};

const EmptyMarkingThumbnailGrid = () => (
  <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
    <img
      src="/default-image.png"
      alt="profileImage"
      className="w-16 h-16 rounded-2xl flex-shrink-0 "
    />
    <div className="text-center body-2 text-grey-500">
      <p>함께 한 특별한 장소를 마킹하고</p>
      <p>추억을 남겨보세요</p>
    </div>
  </div>
);
