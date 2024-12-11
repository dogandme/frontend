import type { FollowUserInfo } from "@/entities/follow/type/server";

export interface FollowItemProps
  extends Pick<FollowUserInfo, "nickname">,
    Pick<FollowUserInfo["pet"], "name" | "profile"> {
  isFollowing?: boolean;
}
