import { useGetDashboardMarkingThumbnail } from "@/entities/marking/api";
import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib/profile";
import { useLoadImages, type LoadImageParams } from "@/shared/lib";

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

  if (!data || isLoading) {
    return <div>loading..</div>;
  }

  if (data.length === 0) {
    return <EmptyMarkingThumbnailGrid />;
  }

  return (
    <section className="w-full grid grid-cols-3 gap-2">
      {data.map((page, index) => (
        <ThumbnailList
          key={index}
          imageList={page.map(({ markingId, previewImage }) => ({
            src: `${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`,
            alt: `${markingId} 의 ${previewImage} `,
          }))}
        />
      ))}
      <div ref={setNode} />
    </section>
  );
};

interface ThumbnailListProps {
  imageList: LoadImageParams[];
}
export const ThumbnailList = ({ imageList }: ThumbnailListProps) => {
  const { images, isLoading } = useLoadImages(imageList);

  if (isLoading) {
    return imageList.map(({ src }) => (
      <div className="aspect-square" key={src}>
        <div className="w-full h-full animate-pulse bg-grey-100" />,
      </div>
    ));
  }

  return images.map(({ src, alt, isError }) => (
    <div className="aspect-square" key={src}>
      {isError ? (
        // TODO : errorFallback 에러 컴포넌트 이야기 나누기
        <div className="w-full h-full">불러오기를 실패한 {alt} 이미지</div>
      ) : (
        <img src={src} className="w-full h-full object-cover rounded-[1rem]" />
      )}
    </div>
  ));
};

const EmptyMarkingThumbnailGrid = () => {
  const { isMyPage } = useNicknameParams();

  return (
    <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
      <img
        src="/default-image.png"
        alt="profileImage"
        className="w-16 h-16 rounded-2xl flex-shrink-0 "
      />
      <div className="text-center body-2 text-grey-500">
        {isMyPage ? (
          <>
            <p>함께한 특별한 장소를 마킹하고</p>
            <p>추억을 남겨보세요</p>
          </>
        ) : (
          <p>마킹이 없습니다</p>
        )}
      </div>
    </div>
  );
};
