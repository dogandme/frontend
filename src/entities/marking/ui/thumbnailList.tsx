import { useLoadImages, type LoadImageParams } from "@/shared/lib";

interface ThumbnailListProps {
  imageList: LoadImageParams[];
  className?: string;
}
export const ThumbnailList = ({
  imageList,
  className = "w-full h-full object-cover rounded-[1rem]",
}: ThumbnailListProps) => {
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
        <img src={src} className={className} />
      )}
    </div>
  ));
};
