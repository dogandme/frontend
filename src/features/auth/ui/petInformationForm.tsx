import { useState, useRef } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import { API_BASE_URL, MASCOT_IMAGE_URL } from "@/shared/constants";
import { useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { SelectChip } from "@/shared/ui/chip";
import { EditIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Snackbar } from "@/shared/ui/snackbar";
import { TextArea } from "@/shared/ui/textarea";
import { personalities, dogBreeds } from "../constants/form";
import {
  createPetInformationFormState,
  PetInformationFormExternalState,
  PetInformationFormStoreContext,
  usePetInformationFormStore,
  usePetInformationFormContext,
} from "../store";

interface PetInformationFormProviderProps {
  children: React.ReactNode;
  initialState?: PetInformationFormExternalState;
}
const PetInformationFormProvider = ({
  children,
  initialState,
}: PetInformationFormProviderProps) => {
  const store = useRef(createPetInformationFormState(initialState)).current;

  return (
    <PetInformationFormStoreContext.Provider value={store}>
      {children}
    </PetInformationFormStoreContext.Provider>
  );
};

interface PetInformationFormProps {
  initialState?: PetInformationFormExternalState;
  onSubmit: (petInfoFormState: PetInformationFormExternalState) => void;
  disabled?: boolean;
}

export const PetInformationForm = ({
  initialState,
  onSubmit,
  disabled,
}: PetInformationFormProps) => {
  return (
    <PetInformationFormProvider initialState={initialState}>
      <section className="flex w-full flex-col items-center gap-4">
        <ProfileInput />
        <NameInput />
        <BreedInput />
        <PersonalitiesInput />
        <PetDescriptionTextArea />
        <SubmitButton onSubmit={onSubmit} disabled={disabled} />
      </section>
    </PetInformationFormProvider>
  );
};

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

const ProfileInput = () => {
  const profile = usePetInformationFormStore((state) => state.profile);
  const setProfile = usePetInformationFormStore((state) => state.setProfile);
  const inputKey = usePetInformationFormStore((state) => state.inputKey);
  // 바텀시트를 조작하기 위한 state
  const [isOpen, setOpen] = useState<boolean>(false);
  // actual dom 의 input 태그를 조작하기 위한 ref , state
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    /**
     * 압축 과정 동안 이미지가 변경되지 않는 것을 방지하기 위해 낙관적 업데이트를 사용합니다.
     */
    setProfile({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  // 바텀 시트를 여닫는 핸들러
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  // 사진을 삭제하는 핸들러
  const handleDelete = () => {
    setProfile({
      file: null,
      name: "",
      url: MASCOT_IMAGE_URL,
    });
  };

  // 사진 선택하기 버튼을 클릭했을 때 input을 클릭하는 핸들기
  const handleInputClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <button
        className="flex h-20 w-20 flex-shrink items-end justify-end rounded-[28px] bg-cover bg-center bg-no-repeat"
        // TODO : backgroundUrl 말고 image 를 이용하여 캐시를 사용하도록 변경하기
        style={{
          backgroundImage: `url(${profile.url ? `${API_BASE_URL}/markings/image/${profile.url}` : MASCOT_IMAGE_URL})`,
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
              disabled={profile.url === MASCOT_IMAGE_URL}
            >
              삭제 하기
            </Select.Option>
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

const NameInput = () => {
  const name = usePetInformationFormStore((state) => state.name);
  const isValidName = usePetInformationFormStore((state) => state.isValidName);
  const setName = usePetInformationFormStore((state) => state.setName);

  const isNameEmpty = name.length === 0;
  const MAX_LENGTH = 20;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 한글,영문,숫자가 아닌 경우 true 를 반환하는 정규식
    const regex = /[^가-힣a-zA-Z0-9ㄱ-ㅎ\s]/g;
    const filteredName = value.replace(regex, "");
    setName(filteredName);
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

const BreedInput = () => {
  const breed = usePetInformationFormStore((state) => state.breed);
  const setBreed = usePetInformationFormStore((state) => state.setBreed);
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

const PersonalitiesInput = () => {
  const { personalities: initialPersonalities } =
    usePetInformationFormContext().getState();

  const setPersonalities = usePetInformationFormStore(
    (state) => state.setPersonalities,
  );

  return (
    <div>
      <p className="title-3 pb-2 text-grey-700">어떤 아이인가요?</p>
      <div className="flex flex-wrap content-center items-center gap-2 self-stretch">
        {personalities.map((personality, idx) => (
          <SelectChip
            key={idx}
            label={personality}
            onClick={() => setPersonalities(personality)}
            uncontrolledInitialIsSelected={initialPersonalities.includes(
              personality,
            )}
          />
        ))}
      </div>
    </div>
  );
};

const PetDescriptionTextArea = () => {
  const { description } = usePetInformationFormContext().getState();
  const setDescription = usePetInformationFormStore(
    (state) => state.setDescription,
  );
  return (
    <TextArea
      id="introduce"
      label="간단히 소개해 주세요"
      placeholder="우리 댕댕이를 간단히 소개해주세요"
      statusText=""
      onChange={(e) => setDescription(e.target.value)}
      defaultValue={description}
    />
  );
};

const SubmitButton = ({
  onSubmit,
  disabled,
}: Omit<PetInformationFormProps, "initialState">) => {
  const store = usePetInformationFormContext();
  // 필수 항목을 모두 입력하지 않은 경우 나타 날 스낵바
  const { handleOpen: openInfoSnackBar, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>필수 항목을 모두 입력해 주세요</Snackbar>
  ));

  const handleClick = () => {
    const petInfoForm = store.getState();
    const {
      isValidName,
      name,
      breed,
      personalities,
      description,
      profile,
      isCompressing,
    } = petInfoForm;

    if (isCompressing) {
      // TODO 에러 바운더리 생성되면 로직 변경하기
      console.error("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    const isNameEmpty = name.length === 0;
    const isBreedEmpty = breed.length === 0;

    // TODO 에러 바운더리 생성되면 로직 변경하기
    if (!isValidName || isNameEmpty || isBreedEmpty) {
      openInfoSnackBar();
      return;
    }

    onSubmit({
      name,
      breed,
      personalities,
      description,
      profile,
    });
  };
  return (
    <Button
      colorType="primary"
      size="large"
      variant="filled"
      onClick={handleClick}
      type="button"
      disabled={disabled}
    >
      등록하기
    </Button>
  );
};
