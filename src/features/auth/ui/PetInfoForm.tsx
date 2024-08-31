import { useState, useRef } from "react";
import { EditIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { SelectChip } from "@/shared/ui/chip";
import { TextArea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/shared/store/auth";
import { usePetInfoStore } from "../store";
import { characterList } from "../constants/form";
import { usePostPetInfo } from "../api/petinfo";
import { useNavigate } from "react-router-dom";
import { useRouteHistoryStore } from "@/shared/store/history";

// TODO svg 경로를 문자열로 가져오는 방법 찾아보기
const DEFAULT_PROFILE_IMAGE = "default-profile.svg";

const TextCounter = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  return (
    <p className="flex items-center justify-center gap-[2px] self-stretch">
      <span>{text.length}</span>
      <span>/</span>
      <span>{maxLength}</span>
    </p>
  );
};

export const Form = ({ children }: { children: React.ReactNode }) => {
  return (
    <form
      className="flex w-full flex-col items-center gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </form>
  );
};

// TODO 바텀시트 완성되고 나면 사진 업로드 , 삭제하기 기능 추가하기
export const ProfileInput = () => {
  const profileImage = usePetInfoStore((state) => state.profileImage);
  const setProfileImage = usePetInfoStore((state) => state.setProfileImage);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 상태에 저장된 파일 객체가 존재하는 경우엔 파일 객체를 URL로 변경하여 사용합니다.
  // 만약 파일 객체가 존재하지 않는 경우 기본 이미지를 제공합니다.
  const profileUrl = profileImage
    ? URL.createObjectURL(profileImage)
    : `${window.location.origin}/${DEFAULT_PROFILE_IMAGE}`;

  const handleInputClick = () => {
    inputRef.current?.click();
  };

  // type이 file인 input에게 파일이 존재하는 경우엔 Blob URL을 생성하여 프로필 이미지로 설정합니다.
  // 만약 사진이 존재하지 않는 경우 기본 이미지를 제공합니다.
  // TODO 바텀 시트가 생성되고 사진 선택하기 , 삭제 기능이 추가되면 로직을 변경해야 합니다.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfileImage(file || null);
  };

  return (
    <div
      className="flex h-20 w-20 flex-shrink items-end justify-end rounded-[28px] bg-tangerine-500 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${profileUrl})`,
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <button
        className="flex h-8 w-8 items-center justify-center rounded-2xl border border-grey-500 bg-grey-0"
        onClick={handleInputClick}
        type="button"
      >
        <EditIcon fill="#9E9E9E" />
      </button>
    </div>
  );
};

export const NameInput = () => {
  const name = usePetInfoStore((state) => state.name);
  const isValidName = usePetInfoStore((state) => state.isValidName);
  const isNameEmpty = name.length === 0;
  const setName = usePetInfoStore((state) => state.setName);
  const setIsValidName = usePetInfoStore((state) => state.setIsValidName);

  const MAX_LENGTH = 20;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 한글,영문,숫자가 아닌 경우 true 를 반환하는 정규식
    const regex = /[^가-힣a-zA-Z0-9ㄱ-ㅎ\s]/g;
    const filteredName = value.replace(regex, "");
    setName(filteredName);
    setIsValidName(filteredName);
  };

  return (
    <Input
      componentType="outlinedText"
      id="name"
      label="이름이 어떻게 되나요?"
      placeholder="한글 또는 영문의 이름을 입력해 주세요"
      maxLength={MAX_LENGTH}
      trailingNode={<TextCounter text={name} maxLength={MAX_LENGTH} />}
      value={name}
      onChange={handleChange}
      isError={!isNameEmpty && !isValidName}
      statusText="20자 이내의 한글 영문의 이름을 입력해 주세요"
      essential
    />
  );
};

export const BreedInput = () => {
  const [isMixDog, setIsMixDog] = useState<boolean>(false);
  const setBreed = usePetInfoStore((state) => state.setBreed);

  return (
    <div className="flex w-full flex-col gap-[10px]">
      {/* TODO select로 변경하기 */}
      <Input
        componentType="outlinedText"
        id="greed"
        label="어떤 종의 아이인가요?"
        placeholder="품종을 선택해 주세요"
        onChange={(e) => setBreed(isMixDog ? "mix" : e.target.value)}
        // TODO disabled 되면 선택된 값을 기본 값으로 변경하기
        disabled={isMixDog}
        essential
      />
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id="isMixDog"
          name="ixMixDog"
          onChange={(e) => {
            const { checked } = e.target;
            if (checked) {
              setBreed("mix");
              setIsMixDog(e.target.checked);
              return;
            }
            setIsMixDog(e.target.checked);
            setBreed("");
          }}
        />
        <label htmlFor="isMixDog" className="btn-3 text-center text-grey-500">
          모르겠어요
        </label>
      </div>
    </div>
  );
};

export const CharacterInput = () => {
  const setCharacterList = usePetInfoStore((state) => state.setCharacterList);

  return (
    <div>
      <p className="title-3 pb-2 text-grey-700">어떤 아이인가요?</p>
      <div className="flex flex-wrap content-center items-center gap-2 self-stretch">
        {characterList.map((character, idx) => (
          <SelectChip
            key={idx}
            label={character}
            onClick={() => setCharacterList(character)}
          />
        ))}
      </div>
    </div>
  );
};

export const IntroduceTextArea = () => {
  const setIntroduce = usePetInfoStore((state) => state.setIntroduce);
  return (
    <TextArea
      id="introduce"
      label="간단히 소개해 주세요"
      placeholder="우리 댕댕이를 간단히 소개해주세요"
      statusText=""
      onChange={(e) => setIntroduce(e.target.value)}
    />
  );
};

export const SubmitButton = () => {
  /**
   * 유효성 검사를 위해 form 데이터에 존재하는 상태를 객체 형태로 가져옵니다.
   * getState() 는 호출 시점의 store 를 가져오기 떄문에 클릭이 일어난 시점의 상태 값들을 가져 올 수 있습니다.
   * getState() 로 인해 반환되는 store 자체는 불변하기 때문에 store 내부 상태들이 변경되어도 리렌더링이 일어나지 않습니다.
   */
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRole = useAuthStore((state) => state.setRole);
  const { mutate: postPetInfo } = usePostPetInfo();

  const handleClick = () => {
    const petInfoForm = usePetInfoStore.getState();
    // TODO refactor : 유효성 검사 메소드 만들어 사용하기
    const { isValidName, name, breed, characterList, introduce, profileImage } =
      petInfoForm;

    const isNameEmpty = name.length === 0;
    const isBreedEmpty = breed.length === 0;

    if (!isValidName || isNameEmpty || isBreedEmpty) {
      alert("필수 항목을 모두 입력해 주세요");
      return;
    }
    // TODO 엔드포인트 양식 정해지면 API 요청 기능 추가하기

    if (!userId) {
      throw new Error(
        "userId가 존재하지 않습니다. userId가 존재하지 않는 경우엔 해당 페이지에 들어올 수 없습니다. 페이지에 접속 할 수 있는 권한의 범위를 확인하세요",
      );
    }

    postPetInfo(
      {
        userId,
        name,
        breed,
        personalities: characterList,
        description: introduce,
        profile: profileImage,
      },
      {
        onSuccess: (data) => {
          const { role } = data.content;
          const { lastNoneAuthRoute } = useRouteHistoryStore.getState();

          setRole(role);
          navigate(lastNoneAuthRoute);
        },
        // TODO 에러 바운더리 생성되면 로직 변경하기
        onError: (error) => {
          throw new Error(error.message);
        },
      },
    );
  };
  return (
    <Button
      colorType="primary"
      size="large"
      variant="filled"
      onClick={handleClick}
      type="button"
    >
      등록하기
    </Button>
  );
};
