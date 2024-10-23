/**
 * 해당 컴포넌트는 다음과 같은 경우 사용 됩니다.
 * 1. 나의 프로필에서 팔로잉 리스트를 확인 할 때
 * 2. 남의 프로필의 팔로잉 리스트를 확인 할 때
 * 3. 남의 프로필의 팔로워 리스트를 확인 할 로
 */
import { AddFollowButton, DeleteFollowButton } from "@/features/follow/ui";
import { Nickname, PetName, ProfileImageUrl } from "@/entities/profile/api";
import { API_BASE_URL, MASCOT_IMAGE_URL } from "@/shared/constants";

interface FollowUserListProps {
  nickname: Nickname;
  petName: PetName;
  profile: ProfileImageUrl;
  isMutualFollow?: boolean;
}
export const FollowUserList = ({
  nickname,
  petName,
  profile,
  isMutualFollow,
}: FollowUserListProps) => {
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
        <p className="title-2 text-grey-900">{nickname}</p>
        <p className="body-3 text-grey-500">{petName}</p>
      </div>
      {isMutualFollow ? <DeleteFollowButton /> : <AddFollowButton />}
    </li>
  );
};
