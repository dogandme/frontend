import { useState } from "react";
import { FilledLikeIcon, LikeIcon } from "@/shared/ui/icon";
import { useDeleteLikeMarking, usePostLikeMarking } from "../api";

interface LikeToggleProps {
  markingId: number;
  isLiked: boolean;
  likedCount: number;
}

export const MarkingLikeToggle = ({
  markingId,
  isLiked,
  likedCount,
}: LikeToggleProps) => {
  const [_isLiked, _setIsLiked] = useState<boolean>(() => isLiked);
  const [_likedCount, _setLikedCount] = useState<number>(() => likedCount);

  const { mutate: postLikeMarking, isPending: isPostLikeMarkingPending } =
    usePostLikeMarking();
  const { mutate: deleteLikeMarking, isPending: isDeleteLikeMarkingPending } =
    useDeleteLikeMarking();

  const handleClickLikeButton = () => {
    postLikeMarking(
      { markingId },
      {
        onSuccess: () => {
          _setIsLiked(true);
          _setLikedCount((prev) => prev + 1);
        },
      },
    );
  };

  const handleClickUnLikeButton = () => {
    deleteLikeMarking(
      { markingId },
      {
        onSuccess: () => {
          _setIsLiked(false);
          _setLikedCount((prev) => prev - 1);
        },
      },
    );
  };

  return (
    <div className="flex gap-2 items-center text-grey-500">
      {_isLiked ? (
        <button
          aria-label={`${markingId} 번 마킹 좋아요 취소`}
          onClick={handleClickUnLikeButton}
          disabled={isDeleteLikeMarkingPending}
          className="text-tangerine-500"
        >
          <FilledLikeIcon />
        </button>
      ) : (
        <button
          aria-label={`${markingId} 번 마킹 좋아요 추가`}
          onClick={handleClickLikeButton}
          disabled={isPostLikeMarkingPending}
        >
          <LikeIcon />
        </button>
      )}
      <span className="title-3">{_likedCount > 0 && _likedCount}</span>
    </div>
  );
};
