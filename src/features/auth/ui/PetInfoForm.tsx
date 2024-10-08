import { useState, useRef } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import { useSnackBar } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store/auth";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { SelectChip } from "@/shared/ui/chip";
import { EditIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Snackbar } from "@/shared/ui/snackbar";
import { TextArea } from "@/shared/ui/textarea";
import { usePostPetInfo } from "../api";
import { characterList, dogBreeds } from "../constants/form";
import { usePetInfoStore } from "../store";

const DEFAULT_PROFILE_IMAGE = "/default-image.png";

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

export const ProfileInput = () => {
  const profileImage = usePetInfoStore((state) => state.profileImage);
  const setProfileImage = usePetInfoStore((state) => state.setProfileImage);
  // 바텀시트를 조작하기 위한 state
  const [isOpen, setOpen] = useState<boolean>(false);
  // actual dom 의 input 태그를 조작하기 위한 ref , state
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputKey, setInputKey] = useState<number>(0);
  // 프로필 이미지를 보여주기 위한 state
  const [profileUrl, setProfileUrl] = useState(() =>
    profileImage ? URL.createObjectURL(profileImage) : DEFAULT_PROFILE_IMAGE,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(file);
    setProfileUrl(URL.createObjectURL(file));
  };

  // 바텀 시트를 여닫는 핸들러
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  // 사진을 삭제하는 핸들러
  const handleDelete = () => {
    setProfileImage(null);
    setInputKey((prev) => prev + 1);
  };

  // 사진 선택하기 버튼을 클릭했을 때 input을 클릭하는 핸들기
  const handleInputClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <button
        className="flex h-20 w-20 flex-shrink items-end justify-end rounded-[28px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${profileUrl})`,
        }}
        onClick={onOpen}
        aria-label="profile-image-button"
      >
        <input
          key={inputKey}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="sr-only"
          id="profile"
          ref={inputRef}
          onChange={handleFileChange}
        />
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-grey-500 bg-grey-0">
          <EditIcon />
        </span>
      </button>
      <Select isOpen={isOpen} onClose={onClose} id="profile-bottom-sheet">
        <Select.BottomSheet>
          <Select.OptionList>
            <Select.Option onClick={handleInputClick}>
              사진 선택하기
            </Select.Option>
            <Select.Option
              onClick={handleDelete}
              disabled={profileImage === null}
            >
              삭제 하기
            </Select.Option>
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

export const NameInput = () => {
  const name = usePetInfoStore((state) => state.name);
  const isValidName = usePetInfoStore((state) => state.isValidName);
  const setName = usePetInfoStore((state) => state.setName);
  const setIsValidName = usePetInfoStore((state) => state.setIsValidName);

  const isNameEmpty = name.length === 0;
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
  const breed = usePetInfoStore((state) => state.breed);
  const setBreed = usePetInfoStore((state) => state.setBreed);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex w-full flex-col gap-[10px]">
        <SelectOpener
          id="breed"
          label="어떤 종의 아이인가요?"
          essential
          value={breed}
          placeholder="품종을 선택해 주세요"
          onClick={onOpen}
          disabled={breed === "모르겠어요"}
        />
        <Checkbox
          id="unknown-breed"
          checked={breed === "모르겠어요"}
          onChange={(e) => {
            const { checked } = e.target;
            if (checked) {
              setBreed("모르겠어요");
              return;
            }
            setBreed("");
          }}
        >
          <span className="btn-3 text-center text-grey-500">모르겠어요</span>
        </Checkbox>
      </div>
      <Select isOpen={isOpen} onClose={onClose}>
        <Select.BottomSheet>
          <Select.OptionList>
            {dogBreeds.map((value, idx) => (
              <Select.Option
                key={idx}
                id={value}
                onClick={() => setBreed(value)}
                isSelected={value === breed}
              >
                {value}
              </Select.Option>
            ))}
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
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
  const { mutate: postPetInfo } = usePostPetInfo();

  // 필수 항목을 모두 입력하지 않은 경우 나타 날 스낵바
  const { handleOpen: openInfoSnackBar, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>필수 항목을 모두 입력해 주세요</Snackbar>
  ));

  const handleClick = () => {
    const petInfoForm = usePetInfoStore.getState();
    const { isValidName, name, breed, characterList, introduce, profileImage } =
      petInfoForm;
    const { token } = useAuthStore.getState();

    const isNameEmpty = name.length === 0;
    const isBreedEmpty = breed.length === 0;

    // TODO 에러 바운더리 생성되면 로직 변경하기
    if (!isValidName || isNameEmpty || isBreedEmpty) {
      openInfoSnackBar();
      return;
    }

    if (!token) {
      throw new Error(
        "토큰이 없다면 해당 페이지에 접근할 수 없습니다. 토큰이 존재하는지 확인해주세요",
      );
    }

    postPetInfo({
      token,
      formObject: {
        name,
        breed,
        personalities: characterList,
        description: introduce,
        profile: profileImage,
      },
    });
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
