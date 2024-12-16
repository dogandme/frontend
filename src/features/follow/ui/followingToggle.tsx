import { useState } from "react";
import { Button, type ButtonProps } from "@/shared/ui/button";
import { usePostFollowing, useDeleteFollowing } from "../api";

interface FollowingToggleProps {
  nickname: string;
  isFollowing: boolean;
  size: Extract<ButtonProps["size"], "small" | "xSmall">;
}

export const FollowingToggle = ({
  nickname,
  isFollowing,
  size,
}: FollowingToggleProps) => {
  const [_isFollowing, _setIsFollowing] = useState(() => isFollowing);

  const { mutate: postFollowing, isPending: isFollowingPending } =
    usePostFollowing();
  const { mutate: deleteFollowing, isPending: isUnFollowingPending } =
    useDeleteFollowing();

  const handleOptimisticFollowing = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (isUnFollowingPending) {
      return;
    }
    _setIsFollowing(true);
    postFollowing(nickname, {
      onError: () => {
        _setIsFollowing(false);
      },
    });
  };

  const handleOptimisticUnFollowing = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (isFollowingPending) {
      return;
    }
    _setIsFollowing(false);
    deleteFollowing(nickname, {
      onError: () => {
        _setIsFollowing(true);
      },
    });
  };

  if (_isFollowing) {
    return (
      <Button
        variant="outlined"
        colorType="tertiary"
        fullWidth={false}
        size={size}
        onClick={handleOptimisticUnFollowing}
      >
        팔로잉
      </Button>
    );
  }
  return (
    <Button
      size={size}
      variant="filled"
      colorType="primary"
      fullWidth={false}
      onClick={handleOptimisticFollowing}
    >
      팔로우
    </Button>
  );
};
