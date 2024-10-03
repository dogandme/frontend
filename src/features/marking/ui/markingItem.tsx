import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { DividerLine } from "@/shared/ui/divider";
import {
  BookmarkIcon,
  FilledBookmarkIcon,
  FilledLikeIcon,
  LikeIcon,
  MoreIcon,
  MyLocationIcon,
} from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { List } from "@/shared/ui/list";
import {
  Marking,
  useDeleteSavedMarking,
  usePostLikeMarking,
  usePostSavedMarking,
  useDeleteLikeMarking,
} from "../api";
import { useDeleteMarking } from "../api";
import { API_BASE_URL } from "../constants";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// todo onRegionClick을 필수 props로 타입 변경
type MarkingItemProps = {
  onRegionClick?: () => void;
} & Omit<Marking, "isVisible" | "isTempSaved" | "userId">;

const MarkingManageButton = ({
  markingId,
}: Pick<MarkingItemProps, "markingId">) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    const isClickedOutside =
      ref.current && !ref.current.contains(e.target as Node);

    if (isClickedOutside) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { mutate: deleteMarking } = useDeleteMarking();

  const handleDeleteMarking = () => {
    const { token, role } = useAuthStore.getState();

    if (token && role === "ROLE_USER") {
      deleteMarking({ token, markingId });
    }

    setIsOpen(false);
  };

  const handleModifyMarking = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative h-fit flex" ref={ref}>
      <button
        className="text-grey-500"
        aria-label="마킹 수정 및 삭제하기 모달을 여는 버튼"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <MoreIcon />
      </button>

      <List
        className={`${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] right-0 bg-grey-0 w-[11.625rem] p-4`}
      >
        <List.Item style={{ height: "3rem" }} onClick={handleModifyMarking}>
          수정하기
        </List.Item>
        <List.Item style={{ height: "3rem" }} onClick={handleDeleteMarking}>
          삭제하기
        </List.Item>
      </List>
    </div>
  );
};

export const MarkingItem = ({
  markingId,
  onRegionClick,
  nickName,
  region,
  pet,
  images,
  content,
  regDt,
  isOwner = false,
  countData: { likedCount, savedCount },
}: MarkingItemProps) => {
  // todo 좋아요, 북마크 api 요청하여 얻은 데이터로 판단
  const isLiked = false;
  const isBookmarked = false;

  const { mutate: postLikeMarking } = usePostLikeMarking();
  const { mutate: deleteLikeMarking } = useDeleteLikeMarking();

  const { mutate: postSavedMarking } = usePostSavedMarking();
  const { mutate: deleteSavedMarking } = useDeleteSavedMarking();

  return (
    <li className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div
          className="flex pr-4 justify-center items-center gap-[.625rem] h-8 text-tangerine-500 cursor-pointer"
          onClick={() => {
            onRegionClick?.();
          }}
        >
          <MyLocationIcon />
          <h2 className="btn-2 text-grey-900">{region}</h2>
        </div>

        {isOwner && <MarkingManageButton markingId={markingId} />}
      </div>

      <div className="flex justify-between items-center gap-1 flex-1">
        <img
          className="w-8 h-8 rounded-2xl"
          src={`${API_BASE_URL}/${pet.profile}`}
          alt={`${pet.name}-profile`}
        />
        <span className="title-3 text-grey-700">{nickName}</span>
        <DividerLine axis="col" />
        <span className="flex-1 body-2 text-grey-500">{pet.name}</span>

        {!isOwner && (
          <Button
            colorType="tertiary"
            size="xSmall"
            variant="outlined"
            fullWidth={false}
          >
            팔로우
          </Button>
        )}
      </div>

      <ImgSlider>
        {images
          .sort((a, b) => a.lank - b.lank)
          .map(({ imageUrl, id }) => (
            <ImgSlider.ImgItem
              key={id}
              src={`${API_BASE_URL}/${imageUrl}`}
              alt={`${pet.name}-marking-image-${id}`}
            />
          ))}
      </ImgSlider>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center text-grey-500">
          <button
            className={isLiked ? "text-tangerine-500" : ""}
            aria-label="마킹 좋아요"
            onClick={() => {
              const { token, role } = useAuthStore.getState();

              if (!token || role === "ROLE_NONE" || role === null) return;

              if (!isLiked) postLikeMarking({ markingId, token });
              else deleteLikeMarking({ markingId, token });
            }}
          >
            {isLiked ? <FilledLikeIcon /> : <LikeIcon />}
          </button>
          <span className="title-3">{likedCount > 0 && likedCount}</span>
        </div>

        <div className="flex gap-2 items-center text-grey-500">
          <button
            className={isBookmarked ? "text-tangerine-500" : ""}
            aria-label="마킹 저장하기"
            onClick={() => {
              const { token, role } = useAuthStore.getState();

              if (!token || role === "ROLE_NONE" || role === null) return;

              if (!isBookmarked) postSavedMarking({ markingId, token });
              else deleteSavedMarking({ markingId, token });
            }}
          >
            {isBookmarked ? <FilledBookmarkIcon /> : <BookmarkIcon />}
          </button>
          <span className="title-3">{savedCount > 0 && savedCount}</span>
        </div>
      </div>

      <p className="text-grey-700 body-2 text-overflow">{content}</p>

      <p className="body-3 text-grey-500">{formatDate(regDt)}</p>
    </li>
  );
};
