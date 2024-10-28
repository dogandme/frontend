import { type MarkingThumbnailInfo } from "@/widgets/marking/api";
import { otherUsers } from "./otherUser";

export const profileMarkingThumbnail: Record<string, MarkingThumbnailInfo[]> = {
  뽀송송: Array.from(
    {
      length: 120,
    },
    (_, i) => ({
      markingId: i,
      previewImage: `뽀송송-${i}-image`,
      lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
      lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
    }),
  ),
  ...otherUsers.reduce<Record<string, MarkingThumbnailInfo[]>>((data, user) => {
    data[user.nickname] = user.markings.map((markingId) => ({
      markingId,
      previewImage: `${user.nickname}-${markingId}-image`,
      lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
      lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
    }));
    return data;
  }, {}),
};
