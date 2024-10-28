import { useEffect, useState } from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}

export const Image = ({
  className = "w-full h-full object-cover rounded-[1rem]",
  loadingFallback,
  errorFallback,
  src,
  alt,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
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

  // TODO 디자이너와 상의하여 이미지 배경 색 생각 하기
  if (isLoading) {
    return (
      loadingFallback || (
        <div className={`animate-pulse bg-grey-100 ${className}`} />
      )
    );
  }
  // TODO 이미지 에러처리시 사용 할 컴포넌트 생각 하기
  if (isError) {
    return errorFallback || <div>{alt}</div>;
  }
  return (
    <img src={src} alt={alt} className={className} loading="lazy" {...props} />
  );
};
