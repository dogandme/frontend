import { forwardRef, InputHTMLAttributes, useEffect, useState } from "react";
import {
  Controller,
  type FieldError,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  AgreementCheckbox,
  SelectOpener,
  SignUpLandingModal,
} from "@/entities/auth/ui";
import type { Region } from "@/entities/map/types/server";
import { useModal } from "@/shared/lib";
import { useAuthStore, useSnackbar } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ActionChip } from "@/shared/ui/chip";
import { MapLocationSearchingIcon } from "@/shared/ui/icon";
import { CancelIcon } from "@/shared/ui/icon";
import { Input, InputWrapper, StatusText } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { usePostCheckDuplicateNickname, usePutAddUserInfo } from "../api";
import {
  userInfoFormErrorMessage,
  userInfoFormValidationMessage,
  nicknameRegex,
} from "../constants";
import { ageRangeOptionList, genderOptionList } from "../constants/form";
import { RegionModal } from "./regionModal";

const NICKNAME_MAX_LENGTH = 20;

type Gender = "FEMALE" | "MALE" | "NONE";
type AgeRange = 10 | 20 | 30 | 40 | 50 | 60;

interface UserInfoRegistrationFormType {
  nickname: string;
  gender: Gender;
  ageRange: AgeRange;
  region: Region[];
  checkList: boolean[];
}

const UserInfoRegistrationForm = () => {
  const setNickname = useAuthStore((state) => state.setNickname);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  const {
    mutate: putUserInfoRegistration,
    data,
    isSuccess,
  } = usePutAddUserInfo();

  const { handleOpen: openLandingModal, onClose: onCloseLandingModal } =
    useModal(() => (
      <SignUpLandingModal
        nickname={data?.nickname ?? ""}
        onClose={() => {
          if (data) {
            setNickname(data.nickname);
            setToken(data.authorization);
            setRole(data.role);

            onCloseLandingModal();
          }
        }}
      />
    ));
  const handleOpenSnackbar = useSnackbar("default");

  useEffect(() => {
    if (isSuccess && data) {
      openLandingModal();
    }
  }, [isSuccess, data]);

  const { handleSubmit, formState, control, setValue, setError, getValues } =
    useForm<UserInfoRegistrationFormType>({
      mode: "onChange",
      defaultValues: {
        nickname: "",
        gender: undefined,
        ageRange: undefined,
        region: [],
        checkList: [false, false, false],
      },
    });
  const { errors, dirtyFields } = formState;

  const onError: SubmitErrorHandler<UserInfoRegistrationFormType> = (
    errors,
  ) => {
    const { nickname, gender, ageRange, region, checkList } = errors;

    if (
      nickname?.type === "required" ||
      gender?.type === "required" ||
      ageRange?.type === "required" ||
      region?.type === "validate"
    ) {
      handleOpenSnackbar(userInfoFormErrorMessage.submit.required);
      return;
    }

    if (nickname?.type === "pattern") {
      handleOpenSnackbar(userInfoFormErrorMessage.submit.invalidNickname);
      return;
    }

    if (checkList?.type === "validate") {
      handleOpenSnackbar(
        userInfoFormErrorMessage.submit.requiredTermsAgreement,
      );
      return;
    }
  };

  const onSubmit: SubmitHandler<UserInfoRegistrationFormType> = ({
    nickname,
    gender,
    ageRange,
    region,
    checkList,
  }) => {
    putUserInfoRegistration({
      nickname,
      gender,
      age: ageRange,
      region: region.map(({ id }) => id),
      marketingYn: checkList[2],
    });
  };

  const { mutate: postCheckDuplicateNickname } =
    usePostCheckDuplicateNickname();

  return (
    <form
      className="flex flex-col gap-8 self-stretch"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <section className="flex flex-col gap-4 self-stretch">
        <Controller
          name="nickname"
          control={control}
          rules={{
            required: userInfoFormErrorMessage.nickname.required,
            pattern: {
              value: nicknameRegex,
              message: userInfoFormErrorMessage.nickname.pattern,
            },
            maxLength: {
              value: NICKNAME_MAX_LENGTH,
              message: userInfoFormErrorMessage.nickname.maxLength,
            },
            onBlur: (e) => {
              postCheckDuplicateNickname(
                { nickname: e.target.value },
                {
                  onError: (error) => {
                    if (error.code === 409) {
                      setError("nickname", {
                        type: "validate",
                        message: userInfoFormErrorMessage.nickname.validate,
                      });
                    }
                  },
                },
              );
            },
            onChange: (e) => {
              // 한글을 입력하면 NICKNAME_MAX_LENGTH를 넘어가는 경우가 있어서 추가
              if (e.target.value.length > NICKNAME_MAX_LENGTH) {
                setValue(
                  "nickname",
                  e.target.value.slice(0, NICKNAME_MAX_LENGTH),
                );
              }
            },
          }}
          render={({ field }) => (
            <NicknameInput
              error={errors.nickname}
              isValid={!!dirtyFields.nickname && !errors.nickname}
              {...field}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <GenderSelect gender={value} onSelect={onChange} />
          )}
        />
        <Controller
          name="ageRange"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <AgeRangeSelect ageRange={value} onSelect={onChange} />
          )}
        />

        <Controller
          name="region"
          control={control}
          rules={{
            validate: (regionList) => regionList.length > 0,
          }}
          render={({ field: { value, onChange } }) => (
            <>
              <RegionSetting regionList={value} onSave={onChange} />
              <MyRegionList
                regionList={value}
                onRemove={(id) => {
                  setValue(
                    "region",
                    getValues("region").filter((region) => region.id !== id),
                  );
                }}
              />
            </>
          )}
        />
      </section>

      <hr className="text-grey-200" />

      <Controller
        name="checkList"
        control={control}
        rules={{
          validate: (checkList) => checkList[0] && checkList[1],
        }}
        render={({ field: { value, onChange } }) => (
          <AgreementCheckboxList
            checkList={value}
            onChangeCheckList={onChange}
          />
        )}
      />

      <Button type="submit" colorType="primary" variant="filled" size="large">
        회원가입
      </Button>
    </form>
  );
};

const GenderSelect = ({
  gender,
  onSelect,
}: {
  gender: Gender;
  onSelect: (gender: Gender) => void;
}) => {
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
                  onClick={() => onSelect(value)}
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

const NicknameInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, value, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = userInfoFormValidationMessage.email;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        type="text"
        id="nickname"
        label="닉네임"
        placeholder="닉네임을 입력해 주세요"
        essential
        componentType="outlinedText"
        isError={!!error}
        maxLength={NICKNAME_MAX_LENGTH}
        trailingNode={
          <div className="flex gap-[.125rem] body-3">
            <span className="text-grey-500">{(value as string).length}</span>
            <span className="text-grey-300">/</span>
            <span className="text-grey-500">{NICKNAME_MAX_LENGTH}</span>
          </div>
        }
        value={value}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

const AgeRangeSelect = ({
  ageRange,
  onSelect,
}: {
  ageRange: AgeRange;
  onSelect: (ageRange: AgeRange) => void;
}) => {
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
                  onClick={() => onSelect(value)}
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

const RegionSetting = ({
  regionList,
  onSave,
}: {
  regionList: Region[];
  onSave: (regionList: Region[]) => void;
}) => {
  const { handleOpen, onClose } = useModal(() => (
    <RegionModal
      onClose={onClose}
      initialState={{ regionList }}
      onSave={(regionList) => {
        onSave(regionList);
        onClose();
      }}
    />
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

const AgreementCheckboxList = ({
  checkList,
  onChangeCheckList,
}: {
  checkList: boolean[];
  onChangeCheckList: (checkList: boolean[]) => void;
}) => {
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

          onChangeCheckList([checked, checked, checked]);
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

              onChangeCheckList(newCheckList);
            }}
            agreementLink={link}
          />
        );
      })}
    </section>
  );
};

const MyRegionList = ({
  regionList,
  onRemove,
}: {
  regionList: Region[];
  onRemove: (id: Region["id"]) => void;
}) => {
  if (regionList.length === 0) {
    return;
  }

  return (
    <ul className="flex items-start gap-2 self-stretch overflow-auto">
      {regionList.map(({ province, cityCounty, subDistrict, id }) => (
        <li className="flex flex-shrink-0" key={id}>
          <ActionChip
            variant="outlined"
            trailingIcon={<CancelIcon width={20} height={20} />}
            key={id}
            onClick={() => onRemove(id)}
            isSelected={true}
          >
            {`${province} ${cityCounty} ${subDistrict}`}
          </ActionChip>
        </li>
      ))}
    </ul>
  );
};

export default UserInfoRegistrationForm;
