import { useEffect, useState } from "react";
import { useRef } from "react";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { EditIcon, DropDownIcon } from "@/shared/ui/icon";

// TODO alt 추가하기
export const ProfileImage = ({ src }: { src: string }) => {
  return (
    <img src={src} alt="profile" className="w-16 h-16 rounded-[1.75rem]" />
  );
};

interface ProfileInfoProps {
  name: string;
  breed: string;
  follower: number;
  following: number;
}

export const ProfileInfo = ({
  name,
  breed,
  follower,
  following,
}: ProfileInfoProps) => {
  return (
    <div className="flex flex-col gap-1 items-start self-stretch">
      <h1 className="text-grey-900 title-2">{name}</h1>
      <h2 className="text-grey-500 body-3">{breed}</h2>
      <p className="text-grey-700 body-3 flex gap-2 items-center">
        <span>
          팔로워 <span className="text-grey-900">{follower}</span>
        </span>
        <div className="w-[1px] h-3 bg-grey-200"></div>
        <span>
          팔로잉 <span className="text-grey-900">{following}</span>
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

interface PetIntroduceProps {
  introduce: string;
}

export const PetIntroduce = ({ introduce }: PetIntroduceProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isEllipsis, setIsEllipsis] = useState<boolean>(false);
  const introduceRef = useRef<HTMLParagraphElement>(null);

  const handleClick = () => setIsSummary((prev) => !prev);
  // summary 상태 일 경우엔 introduce가 한 줄만 보이게 합니다.
  const introduceClassName = isSummary
    ? "text-ellipsis overflow-hidden text-nowrap"
    : "";

  useEffect(() => {
    const $p = introduceRef.current!;
    setIsEllipsis($p.scrollWidth > $p.clientWidth);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 self-stretch text-grey-500 body-2 w-full justify-between">
        <p className={introduceClassName} ref={introduceRef}>
          {introduce}
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

interface PetCharacterListProps {
  characterList: string[];
}
export const PetCharacterList = ({ characterList }: PetCharacterListProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const visibleCharacterList = isSummary
    ? characterList.slice(0, 3)
    : characterList;
  const remainingCharacterCount =
    characterList.length - visibleCharacterList.length;

  const handleClick = () => setIsSummary(false);

  return (
    <ul className="flex gap-2 self-stretch flex-wrap items-center content-center">
      {visibleCharacterList.map((character, index) => (
        <li key={index}>
          <InfoChip size="small">{character}</InfoChip>
        </li>
      ))}
      {
        // summary 상태 일 경우 남은 성격의 개수를 보여줍니다.
        isSummary && remainingCharacterCount > 0 && (
          <li
            key={characterList.length - remainingCharacterCount}
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
