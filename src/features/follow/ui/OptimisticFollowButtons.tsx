import { useState } from "react";
import type { Nickname } from "@/entities/profile/api";
import { Button } from "@/shared/ui/button";
import { ButtonProps } from "@/shared/ui/button/Button";
import { usePostFollowing, useDeleteFollowing } from "../api";

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

  const handleOptimisticFollowing = () => {
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

  const handleOptimisticUnFollowing = () => {
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

type FollowingButtonType = "default" | "mini";

interface FollowingButtonProps<T extends FollowingButtonType>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  buttonType: T;
  size?: T extends "default" ? ButtonProps["size"] : never;
}

export const FollowingButton = <T extends FollowingButtonType>({
  buttonType,
  onClick,
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
        onClick={() => {
          onClick();
        }}
        {...props}
      >
        팔로우
      </Button>
    );
  }
  return (
    <button
      className="btn-3 text-tangerine-500"
      onClick={() => {
        onClick();
      }}
      {...props}
    >
      팔로우
    </button>
  );
};

interface UnFollowingButtonProps
  extends Omit<ButtonProps, "variant" | "colorType" | "children"> {
  onClick: () => void;
}

export const UnFollowingButton = ({
  onClick,
  ...props
}: UnFollowingButtonProps) => {
  return (
    <Button
      variant="outlined"
      colorType="tertiary"
      fullWidth={false}
      onClick={() => {
        onClick();
      }}
      {...props}
    >
      팔로잉
    </Button>
  );
};
