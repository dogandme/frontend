import { useState } from "react";
import { BookmarkIcon, FilledBookmarkIcon } from "@/shared/ui/icon";
import { useDeleteSavedMarking, usePostSaveMarking } from "../api";

interface MarkingBookmarkToggleProps {
  markingId: number;
  isBookmarked: boolean;
  savedCount: number;
}

export const MarkingBookmarkToggle = ({
  markingId,
  isBookmarked,
  savedCount,
}: MarkingBookmarkToggleProps) => {
  const [_isBookmarked, _setIsBookmarked] = useState<boolean>(
    () => isBookmarked,
  );
  const [_savedCount, _setSavedCount] = useState<number>(() => savedCount);

  const { mutate: postSaveMarking, isPending: isPostSaveMarkingPending } =
    usePostSaveMarking();
  const { mutate: deleteSaveMarking, isPending: isDeleteSaveMarkingPending } =
    useDeleteSavedMarking();

  const handleClickSaveButton = () => {
    postSaveMarking(
      { markingId },
      {
        onSuccess: () => {
          _setIsBookmarked(true);
          _setSavedCount((prev) => prev + 1);
        },
      },
    );
  };

  const handleClickUnSaveButton = () => {
    deleteSaveMarking(
      { markingId },
      {
        onSuccess: () => {
          _setIsBookmarked(false);
          _setSavedCount((prev) => prev - 1);
        },
      },
    );
  };

  return (
    <div className="flex gap-2 items-center text-grey-500">
      {_isBookmarked ? (
        <button
          className="text-tangerine-500"
          onClick={handleClickUnSaveButton}
          disabled={isDeleteSaveMarkingPending}
          aria-label={`${markingId} 번 마킹 저장하기 취소`}
        >
          <FilledBookmarkIcon />
        </button>
      ) : (
        <button
          onClick={handleClickSaveButton}
          disabled={isPostSaveMarkingPending}
          aria-label={`${markingId} 번 마킹 저장하기`}
        >
          <BookmarkIcon />
        </button>
      )}
      <span className="title-3">{_savedCount > 0 && _savedCount}</span>
    </div>
  );
};
