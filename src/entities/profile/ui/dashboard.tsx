import { useEffect, useState } from "react";
import { useRef } from "react";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { DividerLine } from "@/shared/ui/divider";
import { EditIcon, DropDownIcon } from "@/shared/ui/icon";
import { PetInfo, UserInfo } from "../api";

type ProfileImageProps = Pick<PetInfo, "profile"> & Pick<UserInfo, "nickname">;
type ProfileHeadingProps = Pick<PetInfo, "name" | "breed"> &
  Pick<UserInfo, "followers" | "followings">;
type PetIntroduceProps = Pick<PetInfo, "description">;
type PetCharacterListProps = Pick<PetInfo, "personalities">;

export const ProfileImage = ({ profile, nickname }: ProfileImageProps) => {
  return (
    <img
      src={
        profile
          ? `${import.meta.env.VITE_API_BASE_URL}/${profile}`
          : "/default-profile.png"
      }
      alt={`${nickname} 의 프로필 사진`}
      className="w-16 h-16 rounded-[1.75rem]"
    />
  );
};

export const ProfileHeading = ({
  name,
  breed,
  followers,
  followings,
}: ProfileHeadingProps) => {
  console.table({
    name,
    breed,
    followers,
    followings,
  });

  return (
    <div className="flex flex-col gap-1 items-start self-stretch">
      <h1 className="text-grey-900 title-2">{name}</h1>
      <h2 className="text-grey-500 body-3">{breed}</h2>
      <p className="text-grey-700 body-3 flex gap-2 items-center">
        <span>
          팔로워 <span className="text-grey-900">{followers.length}</span>
        </span>
        <DividerLine axis="col" />
        <span>
          팔로잉 <span className="text-grey-900">{followings.length}</span>
        </span>
      </p>
    </div>
  );
};

export const ProfileEditButton = () => {
  return (
    <div className="flex flex-grow justify-end">
      <button className="w-6 h-6" aria-label="프로필 설정 수정 하기 버튼">
        <EditIcon />
      </button>
    </div>
  );
};

export const PetIntroduce = ({ description }: PetIntroduceProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isEllipsis, setIsEllipsis] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const $p = descriptionRef.current!;
    setIsEllipsis($p.scrollWidth > $p.clientWidth);
  }, []);

  const handleClick = () => setIsSummary((prev) => !prev);
  // summary 상태 일 경우엔 introduce가 한 줄만 보이게 합니다.

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 self-stretch text-grey-500 body-2 w-full justify-between">
        <p
          className={
            isSummary ? "text-ellipsis overflow-hidden text-nowrap" : ""
          }
          ref={descriptionRef}
        >
          {description}
        </p>
        {isEllipsis && (
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

export const PetCharacterList = ({ personalities }: PetCharacterListProps) => {
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
