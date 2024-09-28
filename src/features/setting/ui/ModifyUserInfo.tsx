import { useState } from "react";
import { genderOptionList, ageRangeOptionList } from "@/shared/constants";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon, CancelIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { settingClassName } from "./setting.styles";

export const ChangeNickNameButton = () => {
  return (
    <button className={settingClassName}>
      <span>닉네임 변경</span>
      <span className="flex items-center">
        <span className="text-grey-700">뽀송이</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </span>
    </button>
  );
};

export const ChangeGenderButton = () => {
  // TODO userInfo Store 나오면 스토어에서 가져오기
  const [gender, setGender] = useState("FEMALE");
  const [isOpen, setIsOpen] = useState(false);

  const selectedName = genderOptionList.find(
    ({ value }) => value === gender,
  )?.name;

  return (
    <>
      <button className={settingClassName} onClick={() => setIsOpen(true)}>
        <span>성별 변경</span>
        <span className="flex items-center">
          <span className="text-grey-700">{selectedName}</span>
          <span className="text-grey-500">
            <ArrowRightIcon />
          </span>
        </span>
      </button>
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

export const ChangeAgeButton = () => {
  // TODO store 나오면 변경하기
  const [ageRange, setAgeRange] = useState(20);
  const [isOpen, setIsOpen] = useState(false);

  const selectedName = ageRangeOptionList.find(
    ({ value }) => value === ageRange,
  )?.name;

  return (
    <>
      <button className={settingClassName} onClick={() => setIsOpen(true)}>
        <span>나이대 변경</span>
        <span className="flex items-center">
          <span className="text-grey-700">{selectedName}</span>
          <span className="text-grey-500">
            <ArrowRightIcon />
          </span>
        </span>
      </button>
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

export const ChangeRegionButton = () => {
  const address = [
    "영등포동 2가",
    "영등포동 3가",
    "영등포동 4가",
    "영등포동 5가",
    "영등포동 6가",
    "영등포동 7가",
  ];

  return (
    <section>
      <button className={settingClassName}>
        <span>동네 설정</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </button>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {address.map((region) => (
          <li className="flex flex-shrink-0" key={region}>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={true}
            >
              {region}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};
