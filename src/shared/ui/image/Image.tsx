import { useCallback, useEffect, useState } from "react";
import { useInfiniteScroll } from "@/shared/lib";

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading"> {
  src: string;
  alt: string;
  lazy?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}

export const Image = ({
  className = "w-full h-full object-cover rounded-[1rem]",
  loadingFallback,
  errorFallback,
  lazy = true,
  src,
  alt,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const loadImage = useCallback(() => {
    const image = document.createElement("img");
    image.src = src;
    image.onload = () => {
      setIsLoading(false);
    };
    image.onerror = () => {
      setIsError(true);
      setIsLoading(false);
    };
  }, [src]);

  const [setNode] = useInfiniteScroll(loadImage);

  useEffect(() => {
    if (!lazy) {
      loadImage();
    }
  }, [lazy, loadImage]);

  // TODO 디자이너와 상의하여 이미지 배경 색 생각 하기
  if (isLoading) {
    return loadingFallback ? (
      <div ref={() => lazy && setNode}>{loadingFallback}</div>
    ) : (
      <div
        className={`animate-pulse bg-grey-100 ${className}`}
        ref={() => lazy && setNode}
      />
    );
  }
  // TODO 이미지 에러처리시 사용 할 컴포넌트 생각 하기
  if (isError) {
    return errorFallback || <div>{alt}</div>;
  }
  return <img src={src} alt={alt} className={className} {...props} />;
};
