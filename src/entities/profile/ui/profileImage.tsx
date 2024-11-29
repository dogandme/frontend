import { API_BASE_URL } from "@/shared/constants";
import { useImageState } from "@/shared/lib";
import { Nickname } from "../api";

const profileSizeMap = {
  small: "w-6 h-6",
  medium: "w-10 h-10",
  large: "w-20 h-20",
} as const;

interface ProfileImageProps {
  imageUrl: string;
  nickname: Nickname;
  size: keyof typeof profileSizeMap;
  className?: string;
}

export const ProfileImage = ({
  imageUrl,
  nickname,
  size,
  className = "",
}: ProfileImageProps) => {
  const src = `${API_BASE_URL}/pets/image/${imageUrl}`;

  const { isLoading, getImageCache } = useImageState(
    `${API_BASE_URL}/pets/image/${imageUrl}`,
  );

  if (isLoading) {
    return <div className={`${profileSizeMap[size]} ${className}  skeleton`} />;
  }
  return (
    <img
      src={getImageCache(src).isSuccess ? src : "/default-image.png"}
      alt={`${nickname}의 프로필 이미지`}
      className={`object-cover  ${profileSizeMap[size]} ${className}`}
    />
  );
};

export const EmptyProfileImage = ({
  size,
  className = "",
}: {
  size: keyof typeof profileSizeMap;
  className?: string;
}) => (
  <img
    src="/default-image.png"
    className={`object-cover  ${profileSizeMap[size]} ${className}`}
  />
);
