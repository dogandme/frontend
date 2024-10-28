import { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import { Image, type ImageProps } from "@/shared/ui/image";
import type { MarkingId, PreviewImage } from "../api";

interface DashboardMarkingThumbnailProps
  extends Omit<ImageProps, "src" | "alt"> {
  nickname: Nickname;
  markingId: MarkingId;
  previewImage: PreviewImage;
}
export const DashboardMarkingThumbnail = ({
  nickname,
  markingId,
  previewImage,
}: DashboardMarkingThumbnailProps) => (
  <Image
    src={`${API_BASE_URL}/markings/image/preview/${markingId}/${previewImage}`}
    alt={`${nickname}의 ${markingId} 마킹의 썸네일 이미지`}
  />
);
