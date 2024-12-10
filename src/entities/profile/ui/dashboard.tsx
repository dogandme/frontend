import { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { DividerLine } from "@/shared/ui/divider";
import { DropDownIcon } from "@/shared/ui/icon";
import type { ProfileInfo, PetInfo } from "../api";

type ProfileHeadingProps = Pick<ProfileInfo, "followersIds" | "followingsIds"> &
  Pick<PetInfo, "breed" | "name">;

export const ProfileHeading = ({
  name,
  breed,
  followersIds,
  followingsIds,
}: ProfileHeadingProps) => {
  return (
    <div className="flex flex-col gap-1 items-start self-stretch">
      <h1 className="text-grey-900 title-2">{name}</h1>
      <h2 className="text-grey-500 body-3">{breed}</h2>
      <p className="text-grey-700 body-3 flex gap-2 items-center">
        <Link to={ROUTER_PATH.FOLLOWERS}>
          팔로워 <span className="text-grey-900">{followersIds.length}</span>
        </Link>
        <DividerLine axis="col" />
        <Link to={ROUTER_PATH.FOLLOWINGS}>
          팔로잉 <span className="text-grey-900">{followingsIds.length}</span>
        </Link>
      </p>
    </div>
  );
};

interface PetDescriptionTextProps {
  description: NonNullable<PetInfo["description"]>;
}

export const PetDescriptionText = ({
  description,
}: PetDescriptionTextProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isEllipsis, setIsEllipsis] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // 줄바꿈이 적용된 배열
  const multiLineDescription = description.split("\n");
  const isMultiLine = multiLineDescription.length > 1;
  const renderDescription = () => {
    if (isMultiLine) {
      return isSummary
        ? multiLineDescription[0]
        : multiLineDescription.map((line, index) => (
            <p className="min-h-4" key={index}>
              {line}
            </p>
          ));
    }
    return description;
  };

  useEffect(() => {
    const $p = descriptionRef.current!;
    setIsEllipsis($p.scrollWidth > $p.clientWidth);
  }, []);

  const handleClick = () => setIsSummary((prev) => !prev);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 self-stretch text-grey-500 body-2 w-full justify-between">
        <div
          className={
            isSummary ? "text-ellipsis overflow-hidden text-nowrap" : ""
          }
          ref={descriptionRef}
        >
          {renderDescription()}
        </div>
        {(isMultiLine || isEllipsis) && (
          <button
            className="w-4 h-4"
            onClick={handleClick}
            aria-label="강아지 소개 글 더 보기"
          >
            <DropDownIcon />
          </button>
        )}
      </div>
    </div>
  );
};

type PetPersonalityListProps = Pick<PetInfo, "personalities">;

export const PetPersonalityList = ({
  personalities,
}: PetPersonalityListProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);

  const visiblePersonalities = isSummary
    ? personalities.slice(0, 3)
    : personalities;
  const remainingCharacterCount =
    personalities.length - visiblePersonalities.length;

  const handleClick = () => setIsSummary(false);

  return (
    <ul className="flex gap-2 self-stretch flex-wrap items-center content-center">
      {visiblePersonalities.map((personality, index) => (
        <li key={index}>
          <InfoChip size="small">{personality}</InfoChip>
        </li>
      ))}
      {
        // summary 상태 일 경우 남은 성격의 개수를 보여줍니다.
        isSummary && remainingCharacterCount > 0 && (
          <li
            key={personalities.length - remainingCharacterCount}
            onClick={handleClick}
            className="cursor-pointer"
          >
            <InfoChip size="small">+{remainingCharacterCount}</InfoChip>
          </li>
        )
      }
    </ul>
  );
};
