import { useState } from "react";
import { FollowingButton, DeleteFollowerButton } from "@/features/follow/ui";
import type {
  Nickname,
  PetName,
  ProfileImageUrl,
} from "@/entities/profile/api";
import { API_BASE_URL, MASCOT_IMAGE_URL } from "@/shared/constants";

interface FollowerUserItemProps {
  nickname: Nickname;
  petName: PetName;
  profile: ProfileImageUrl;
  isFollowing?: boolean;
}
export const FollowerUserItem = ({
  nickname,
  petName,
  profile,
  isFollowing,
}: FollowerUserItemProps) => {
  const [_isFollowing, _setIsFollowing] = useState(() => isFollowing);

  return (
    <li className="px-4 flex  gap-4 overflow-y-auto">
      {/* TODO 로딩상태가 함께 있는 ProfileImage 컴포넌트 만들어서 대체하기 */}
      <img
        src={
          profile ? `${API_BASE_URL}/pets/image/${profile}` : MASCOT_IMAGE_URL
        }
        className="w-10 h-10 rounded-[1.75rem]"
      />
      <div className="flex flex-col justify-center flex-1">
        <div className="flex gap-2">
          <p className="title-2 text-grey-900">{nickname}</p>
          {!_isFollowing && (
            <FollowingButton
              type="mini"
              onClick={() => _setIsFollowing(!_isFollowing)}
            />
          )}
        </div>
        <p className="body-3 text-grey-500">{petName}</p>
      </div>
      <DeleteFollowerButton />
    </li>
  );
};
