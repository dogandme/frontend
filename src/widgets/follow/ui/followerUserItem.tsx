import { useState } from "react";
import { useDeleteFollower, usePostFollowing } from "@/features/follow/api";
import { DeleteFollowerButton } from "@/features/follow/ui";
import { ProfileLink } from "@/features/profile/ui";
import { EmptyProfileImage, ProfileImage } from "@/entities/profile/ui";
import type { FollowItemProps } from "../types/client";

export const FollowerUserItem = ({
  nickname,
  name,
  profile,
  isFollowing,
}: FollowItemProps) => {
  const [_isFollowing, _setIsFollowing] = useState(() => isFollowing);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const { mutate: postFollowing } = usePostFollowing();
  const { mutate: deleteFollower } = useDeleteFollower();

  const handleOptimisticFollowing = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    _setIsFollowing(true);
    postFollowing(nickname, {
      onError: () => {
        _setIsFollowing(false);
      },
    });
  };

  const handleOptimisticDeleteFollower = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

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
    <ProfileLink
      nickname={nickname}
      className="px-4 flex  gap-4 overflow-y-auto"
    >
      {profile ? (
        <ProfileImage
          imageUrl={profile}
          nickname={nickname}
          size="large"
          className="rounded-[1.75rem]"
        />
      ) : (
        <EmptyProfileImage size="large" className="rounded-[1.75rem]" />
      )}
      <div className="flex flex-col justify-center flex-1">
        <div className="flex gap-2">
          <p className="title-2 text-grey-700">{nickname}</p>
          {!_isFollowing && (
            <button
              className="btn-3 text-tangerine-500"
              onClick={handleOptimisticFollowing}
            >
              팔로우
            </button>
          )}
        </div>
        <p className="body-3 text-grey-500">{name}</p>
      </div>
      <DeleteFollowerButton onClick={handleOptimisticDeleteFollower} />
    </ProfileLink>
  );
};
