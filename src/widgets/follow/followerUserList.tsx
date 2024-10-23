import { useState } from "react";
import { AddFollowButton, DeleteFollowerButton } from "@/features/follow/ui";
import { Nickname, PetName, ProfileImageUrl } from "@/entities/profile/api";
import { API_BASE_URL, MASCOT_IMAGE_URL } from "@/shared/constants";

interface FollowerUserListProps {
  nickname: Nickname;
  petName: PetName;
  profile: ProfileImageUrl;
  isMutualFollow?: boolean;
}
export const FollowerUserList = ({
  nickname,
  petName,
  profile,
  isMutualFollow,
}: FollowerUserListProps) => {
  const [_isMutualFollow, _setIsMutualFollow] = useState(() => isMutualFollow);

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
          {/* TODO 미니 팔로우 버튼으로 만들기 */}
          {!_isMutualFollow && (
            <AddFollowButton
              type="mini"
              onClick={() => _setIsMutualFollow(!_isMutualFollow)}
            />
          )}
        </div>
        <p className="body-3 text-grey-500">{petName}</p>
      </div>
      <DeleteFollowerButton />
    </li>
  );
};
