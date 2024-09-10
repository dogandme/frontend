import { useState } from "react";
import { AgreementCheckbox, SelectOpener } from "@/entities/auth/ui";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store/auth";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { MapLocationSearchingIcon } from "@/shared/ui/icon";
import { CancelIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Snackbar } from "@/shared/ui/snackbar";
import { usePutUserInfoRegistration } from "../api";
import { ageRangeOptionList, genderOptionList } from "../constants/form";
import { validateNickname } from "../lib";
import { useUserInfoRegistrationFormStore } from "../store";
import { RegionModal } from "./RegionModal";

const NicknameInput = () => {
  const isValidNickname = useUserInfoRegistrationFormStore(
    (state) => state.isValidNickname,
  );
  const setNickname = useUserInfoRegistrationFormStore(
    (state) => state.setNickname,
  );
  const setIsValidNickname = useUserInfoRegistrationFormStore(
    (state) => state.setIsValidNickname,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: nickname } = e.target;
    const isValidNickname = validateNickname(nickname);

    const isNicknameEmpty = nickname.length === 0;

    setNickname(nickname);
    setIsValidNickname(isValidNickname || isNicknameEmpty);
  };

  return (
    <Input
      type="text"
      id="nickname"
      name="nickname"
      label="닉네임"
      placeholder="닉네임을 입력해 주세요"
      statusText="20자 이내의 한글 영어 숫자만 사용 가능합니다."
      essential
      componentType="outlinedText"
      isError={!isValidNickname}
      onChange={handleChange}
      maxLength={20}
    />
  );
};

const GenderSelect = () => {
  const gender = useUserInfoRegistrationFormStore((state) => state.gender);
  const setGender = useUserInfoRegistrationFormStore(
    (state) => state.setGender,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedName = genderOptionList.find(
    ({ value }) => value === gender,
  )?.name;

  return (
    <>
      <div className="pb-5">
        <SelectOpener
          id="gender"
          name="gender"
          label="성별"
          essential
          placeholder="성별을 선택해 주세요"
          value={selectedName ?? ""}
          onClick={() => {
            setIsOpen(true);
          }}
          aria-controls="gender-select"
        />
      </div>

      <Select
        id="gender-select"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Select.BottomSheet>
          <Select.OptionList>
            {genderOptionList.map(({ value, name }) => {
              return (
                <Select.Option
                  key={value}
                  value={value}
                  isSelected={value === gender}
                  onClick={() => setGender(value)}
                >
                  {name}
                </Select.Option>
              );
            })}
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

const AgeRangeSelect = () => {
  const ageRange = useUserInfoRegistrationFormStore((state) => state.ageRange);
  const setAgeRange = useUserInfoRegistrationFormStore(
    (state) => state.setAgeRange,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedName = ageRangeOptionList.find(
    ({ value }) => value === ageRange,
  )?.name;

  return (
    <>
      <div className="pb-5">
        <SelectOpener
          id="age-range"
          name="age-range"
          label="연령대"
          essential
          value={selectedName ?? ""}
          onClick={() => setIsOpen(true)}
          placeholder="연령대를 선택해 주세요"
          aria-controls="age-range-select"
        />
      </div>

      <Select
        id="age-range-select"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Select.BottomSheet>
          <Select.OptionList>
            {ageRangeOptionList.map(({ value, name }) => {
              return (
                <Select.Option
                  key={value}
                  value={value}
                  isSelected={value === ageRange}
                  onClick={() => setAgeRange(value)}
                >
                  {name}
                </Select.Option>
              );
            })}
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

const RegionSetting = () => {
  const { handleOpen, onClose } = useModal(() => (
    <RegionModal onClose={onClose} />
  ));

  return (
    <div>
      <div className="flex items-start gap-1 pb-2">
        <span className="title-3 text-grey-700">동네설정</span>
        <Badge colorType="primary" />
      </div>

      <Button
        type="button"
        variant="outlined"
        colorType="tertiary"
        size="medium"
        onClick={handleOpen}
      >
        <MapLocationSearchingIcon />
        <span>동네 설정하기</span>
      </Button>
    </div>
  );
};

const AgreementCheckboxList = () => {
  const agreementList = [
    {
      id: "terms-of-service-agreement",
      label: "이용약관 동의 (필수)",
      link: "/",
    },
    {
      id: "privacy-policy-agreement",
      label: "개인정보 수집 및 이용 동의 (필수)",
      link: "/",
    },
    {
      id: "marketing-information-agreement",
      label: "마케팅 정보 수신 동의 (선택)",
      link: "/",
    },
  ];

  const checkList = useUserInfoRegistrationFormStore(
    (state) => state.checkList,
  );
  const setCheckList = useUserInfoRegistrationFormStore(
    (state) => state.setCheckList,
  );

  // 전체 선택되어 있는 경우
  const allChecked = checkList.every(Boolean);
  // 전체 선택되어 있지 않고 하나 이상 선택되어 있는 경우
  const isIndeterminate = checkList.some(Boolean) && !allChecked;

  return (
    <section className="flex flex-col gap-4">
      <AgreementCheckbox
        id="agree-to-all-terms"
        checked={allChecked}
        isIndeterminate={isIndeterminate}
        label="전체 동의합니다."
        onChange={(e) => {
          const { checked } = e.target;

          setCheckList([checked, checked, checked]);
        }}
      />

      {agreementList.map(({ id, label, link }, idx) => {
        return (
          <AgreementCheckbox
            key={id}
            id={id}
            checked={checkList[idx]}
            label={label}
            onChange={() => {
              const newCheckList = [...checkList];
              newCheckList[idx] = !newCheckList[idx];

              setCheckList(newCheckList);
            }}
            agreementLink={link}
          />
        );
      })}
    </section>
  );
};

const MyRegionList = () => {
  const region = useUserInfoRegistrationFormStore((state) => state.region);
  const setRegion = useUserInfoRegistrationFormStore(
    (state) => state.setRegion,
  );

  if (region.length === 0) {
    return;
  }

  const handleRemoveRegion = (address: string) => {
    setRegion(region.filter((region) => region.address !== address));
  };

  return (
    <ul className="flex items-start gap-2 self-stretch overflow-auto">
      {region.map(({ address, id }) => (
        <li className="flex flex-shrink-0" key={id}>
          <ActionChip
            variant="outlined"
            label={address}
            trailingIcon={<CancelIcon width={20} height={20} />}
            controlledIsSelected={true}
            key={id}
            onClick={() => handleRemoveRegion(address)}
          />
        </li>
      ))}
    </ul>
  );
};

const UserInfoRegistrationForm = () => {
  const {
    handleOpen: openRequiredFieldsAlert,
    onClose: closeRequiredFieldsAlert,
  } = useSnackBar(() => (
    <Snackbar onClose={closeRequiredFieldsAlert}>
      필수 항목을 모두 입력해 주세요
    </Snackbar>
  ));
  const { handleOpen: openNicknameAlert, onClose: closeNicknameAlert } =
    useSnackBar(() => (
      <Snackbar onClose={closeNicknameAlert}>
        올바른 닉네임을 입력해 주세요
      </Snackbar>
    ));
  const { handleOpen: openAgreementAlert, onClose: closeAgreementAlert } =
    useSnackBar(() => (
      <Snackbar onClose={closeAgreementAlert}>
        필수 약관에 모두 동의해 주세요
      </Snackbar>
    ));

  const token = useAuthStore((state) => state.token);
  const setNickname = useAuthStore((state) => state.setNickname);
  const setRole = useAuthStore((state) => state.setRole);

  const { mutate: putUserInfoRegistration } = usePutUserInfoRegistration();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { nickname, ageRange, gender, checkList, region } =
      useUserInfoRegistrationFormStore.getState();

    if (!token) {
      throw new Error("로그인 정보가 없습니다");
    }

    const isNicknameEmpty = nickname.length === 0;

    // todo: 조건에 region !== null인 경우 추가하기
    const areEssentialFieldsFilled =
      !isNicknameEmpty &&
      ageRange !== null &&
      gender !== null &&
      region.length > 0;

    if (!areEssentialFieldsFilled) {
      openRequiredFieldsAlert();
      return;
    }

    const isValidNickname = validateNickname(nickname);

    if (!isValidNickname) {
      openNicknameAlert();
      return;
    }

    const areRequiredAgreementsChecked = checkList[0] && checkList[1];

    if (!areRequiredAgreementsChecked) {
      openAgreementAlert();
      return;
    }

    // todo: region 수정
    putUserInfoRegistration(
      {
        token,
        nickname,
        gender,
        age: ageRange,
        region: region.map(({ id }) => id),
        marketingYn: checkList[2],
      },
      {
        onSuccess: (data) => {
          const {
            content: { nickname, role },
          } = data;

          setNickname(nickname);
          setRole(role);

          // todo: 회원가입 완료 페이지로 이동
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-8 self-stretch" onSubmit={handleSubmit}>
      <section className="flex flex-col gap-4 self-stretch">
        <NicknameInput />
        <GenderSelect />
        <AgeRangeSelect />
        <RegionSetting />
        <MyRegionList />
      </section>

      <hr className="text-grey-200" />

      <AgreementCheckboxList />

      <Button type="submit" colorType="primary" variant="filled" size="large">
        회원가입
      </Button>
    </form>
  );
};

export default UserInfoRegistrationForm;
