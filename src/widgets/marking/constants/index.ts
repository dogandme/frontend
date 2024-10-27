import type { Nickname } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";

export const MARKING_THUMBNAIL_ENDPOINT = {
  DASHBOARD: (nickname: Nickname, pageParams: number) =>
    `${API_BASE_URL}/markings/marks/${nickname}?offset=${pageParams}`,
};
