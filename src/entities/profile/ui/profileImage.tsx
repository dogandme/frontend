import { API_BASE_URL } from "@/shared/constants";
import { useImageState } from "@/shared/lib";
import type { ProfileInfo } from "../types/server";

const profileSizeMap = {
  small: "w-6 h-6",
  medium: "w-8 h-8",
  large: "w-10 h-10",
  xLarge: "w-20 h-20",
} as const;

interface ProfileImageProps extends Pick<ProfileInfo, "nickname"> {
  imageUrl: string;
  size: keyof typeof profileSizeMap;
  className?: string;
}

export const ProfileImage = ({
  imageUrl,
  nickname,
  size,
  className = "",
}: ProfileImageProps) => {
  const src = import.meta.env.DEV
    ? imageUrl
    : `${API_BASE_URL}/pets/image/${imageUrl}`;

  const { isLoading, imageState } = useImageState(src);

  if (isLoading) {
    return <div className={`${profileSizeMap[size]} ${className} skeleton`} />;
  }
  return (
    <img
      src={imageState[src].isSuccess ? src : "/failed_image.svg"}
      alt={`${nickname}의 프로필 이미지`}
      className={`object-cover ${profileSizeMap[size]} ${className}`}
    />
  );
};

type EmptyProfileImageProps = Omit<ProfileImageProps, "imageUrl" | "nickname">;

export const EmptyProfileImage = ({
  size,
  className = "",
}: EmptyProfileImageProps) => (
  <img
    src="/default-image.png"
    className={`object-cover ${profileSizeMap[size]} ${className}`}
  />
);
