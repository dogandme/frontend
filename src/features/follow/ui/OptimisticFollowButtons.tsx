import { useState } from "react";
import type { Nickname } from "@/entities/profile/api";
import { Button } from "@/shared/ui/button";
import { ButtonProps } from "@/shared/ui/button/Button";
import { usePostFollowing, useDeleteFollowing } from "../api";

type FollowingButtonType = "default" | "mini";

interface OptimisticFollowButtonsProps<T extends FollowingButtonType> {
  nickname: Nickname;
  isFollowing: boolean;
  followingButtonType: T;
  size: T extends "default" ? ButtonProps["size"] : never;
}
export const OptimisticFollowButtons = <T extends FollowingButtonType>({
  nickname,
  isFollowing,
  followingButtonType,
  size,
}: OptimisticFollowButtonsProps<T>) => {
  const [_isFollowing, _setIsFollowing] = useState(() => isFollowing);

  const { mutate: postFollowing, isPending: isFollowingPending } =
    usePostFollowing();
  const { mutate: deleteFollowing, isPending: isUnFollowingPending } =
    useDeleteFollowing();

  const handleOptimisticFollowing = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
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
    event.stopPropagation();
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
      <UnFollowingButton onClick={handleOptimisticUnFollowing} size={size} />
    );
  }
  return (
    <FollowingButton
      onClick={handleOptimisticFollowing}
      buttonType={followingButtonType}
      size={size}
    />
  );
};

interface FollowingButtonProps<T extends FollowingButtonType>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: T;
  size?: T extends "default" ? ButtonProps["size"] : never;
}

export const FollowingButton = <T extends FollowingButtonType>({
  buttonType,
  size,
  ...props
}: FollowingButtonProps<T>) => {
  if (buttonType === "default") {
    return (
      <Button
        size={size || "small"}
        variant="filled"
        colorType="primary"
        fullWidth={false}
        {...props}
      >
        팔로우
      </Button>
    );
  }
  return (
    <button className="btn-3 text-tangerine-500" {...props}>
      팔로우
    </button>
  );
};

export const UnFollowingButton = (
  props: Omit<ButtonProps, "variant" | "colorType" | "children">,
) => {
  return (
    <Button
      variant="outlined"
      colorType="tertiary"
      fullWidth={false}
      {...props}
    >
      팔로잉
    </Button>
  );
};
