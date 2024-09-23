import { useState } from "react";
import { EditIcon, DropDownIcon } from "@/shared/ui/icon";

// TODO alt 추가하기
export const ProfileImage = ({ src }: { src: string }) => {
  return <img src={src} alt="profile" className="w-16 h-16 rounded-[28px]" />;
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
      <button className="w-6 h-6">
        <EditIcon />
      </button>
    </div>
  );
};

interface PetCharacterChipProps {
  value: string;
}

export const PetCharacterChip = ({ value }: PetCharacterChipProps) => (
  <span className="h-8 px-3 flex items-center justify-center btn-3 text-grey-700 text-center rounded-2xl border border-grey-500">
    {value}
  </span>
);

interface PetIntroduceProps {
  introduce: string;
  characterList: string[];
}

export const PetIntroduce = ({
  introduce,
  characterList,
}: PetIntroduceProps) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);

  const handleClick = () => setIsSummary((prev) => !prev);
  // summary 상태 일 경우엔 introduce가 한 줄만 보이게 합니다.
  const introduceClassName = isSummary
    ? "text-ellipsis overflow-hidden text-nowrap"
    : "";

  // summary 상태 일 경우엔 characterList가 3개까지만 보이고 남은 성격은 남은 성격의 개수를 보여줍니다.
  const characterListLength = characterList.length;
  const visibleCharacterList = isSummary
    ? characterList.slice(0, 3)
    : characterList;
  const remainingCharacterCount =
    characterListLength - visibleCharacterList.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 self-stretch text-grey-500 body-2 w-full">
        <p className={introduceClassName}>{introduce}</p>
        {/* TODO 버튼 클릭 시 글 늘어나게  */}
        <button className="w-4 h-4" onClick={handleClick}>
          <DropDownIcon />
        </button>
      </div>
      <div className="flex gap-2 self-stretch flex-wrap items-center content-center">
        {visibleCharacterList.map((character, index) => (
          <PetCharacterChip key={index} value={character} />
        ))}
        {
          // summary 상태 일 경우 남은 성격의 개수를 보여줍니다.
          isSummary && remainingCharacterCount > 0 && (
            <PetCharacterChip value={`+${remainingCharacterCount}`} />
          )
        }
      </div>
    </div>
  );
};
