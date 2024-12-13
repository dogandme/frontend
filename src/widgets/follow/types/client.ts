import type { FollowUserInfo } from "@/entities/follow/types/server";

export interface FollowItemProps
  extends Pick<FollowUserInfo, "nickname">,
    Pick<FollowUserInfo["pet"], "name" | "profile"> {
  isFollowing?: boolean;
}
