import { useEffect, useRef, useState } from "react";
import type { Marking } from "@/entities/marking/api";
import type { PetInfo } from "@/entities/profile/api";
import { API_BASE_URL } from "@/shared/constants";
import { formatDateToYearMonthDay, useClickOutside } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { DividerLine } from "@/shared/ui/divider";
import { MoreIcon, MyLocationIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { List } from "@/shared/ui/list";
import { useDeleteMarking } from "../api";
import { MarkingBookmarkToggle } from "./markingBookmarkToggle";
import { MarkingLikeToggle } from "./markingLikeToggle";

interface MarkingItemProps
  extends Omit<Marking, "isVisible" | "isTempSaved" | "userId" | "pet"> {
  onRegionClick: () => void;
  pet: Pick<PetInfo, "petId" | "profile" | "name">;
  isLiked: boolean;
  isBookmarked: boolean;
}
const MarkingManageButton = ({
  markingId,
}: Pick<MarkingItemProps, "markingId">) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const { mutate: deleteMarking } = useDeleteMarking();

  const handleDeleteMarking = () => {
    const { token, role } = useAuthStore.getState();

    if (token && role === "ROLE_USER") {
      deleteMarking({ markingId });
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
        className={`${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] right-0 bg-grey-0 p-4`}
        style={{
          width: "11.625rem",
        }}
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
  isLiked,
  isBookmarked,
  countData: { likedCount, savedCount },
}: MarkingItemProps) => {
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
          className="w-8 h-8 rounded-2xl object-cover"
          src={`${API_BASE_URL}/pets/image/${pet.profile}`}
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
        {images.map(({ imageUrl, id }) => (
          <ImgSlider.ImgItem
            key={id}
            src={`${API_BASE_URL}/markings/image/${markingId}/${imageUrl}`}
            alt={`${pet.name}의 마킹 이미지`}
          />
        ))}
      </ImgSlider>
      <div className="flex justify-between">
        <MarkingLikeToggle
          markingId={markingId}
          isLiked={isLiked}
          likedCount={likedCount}
        />
        <MarkingBookmarkToggle
          markingId={markingId}
          isBookmarked={isBookmarked}
          savedCount={savedCount}
        />
      </div>
      <p className="text-grey-700 body-2 text-overflow">{content}</p>
      <p className="body-3 text-grey-500">{formatDateToYearMonthDay(regDt)}</p>
    </li>
  );
};
