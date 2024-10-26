import { useState } from "react";
import { useDeleteFollower, usePostFollowing } from "@/features/follow/api";
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
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const { mutate: postFollowing } = usePostFollowing();
  const { mutate: deleteFollower } = useDeleteFollower();

  const handleOptimisticFollowing = () => {
    _setIsFollowing(true);
    postFollowing(nickname, {
      onError: () => {
        _setIsFollowing(false);
      },
    });
  };

  const handleOptimisticDeleteFollower = () => {
    setIsDeleted(true);
    deleteFollower(nickname, {
      onError: () => {
        setIsDeleted(false);
      },
    });
  };

  if (isDeleted) {
    return null;
  }

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
          <p className="title-2 text-grey-700">{nickname}</p>
          {!_isFollowing && (
            <FollowingButton
              buttonType="mini"
              onClick={handleOptimisticFollowing}
            />
          )}
        </div>
        <p className="body-3 text-grey-500">{petName}</p>
      </div>
      <DeleteFollowerButton onClick={handleOptimisticDeleteFollower} />
    </li>
  );
};
