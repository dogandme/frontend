import { useState } from "react";
import { useStore } from "zustand";
import { Region } from "@/shared/api";
import { useModal } from "@/shared/lib";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon, CancelIcon } from "@/shared/ui/icon";
import { RegionModal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { genderOptionList, ageRangeOptionList } from "../constants";
import { useChangeNickNameModal } from "../lib/modal";
import { ModifyUserInfoFormStore } from "../store";
import { settingClassName } from "./setting.styles";

export const ChangeNickNameButton = ({
  store,
}: {
  store: ModifyUserInfoFormStore;
}) => {
  const nickname = useStore(store, (state) => state.nickname);
  const handleOpenChangeNicknameModal = useChangeNickNameModal(store);

  return (
    <button
      className={settingClassName}
      onClick={handleOpenChangeNicknameModal}
    >
      <span>닉네임 변경</span>
      <span className="flex items-center">
        <span className="text-grey-700">{nickname}</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </span>
    </button>
  );
};

export const ChangeGenderButton = ({
  store,
}: {
  store: ModifyUserInfoFormStore;
}) => {
  const gender = useStore(store, (state) => state.gender);
  const setGender = useStore(store, (state) => state.setGender);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={settingClassName} onClick={() => setIsOpen(true)}>
        <span>성별 변경</span>
        <span className="flex items-center">
          <span className="text-grey-700">{gender}</span>
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
            {genderOptionList.map((value) => {
              return (
                <Select.Option
                  key={value}
                  value={value}
                  isSelected={value === gender}
                  onClick={() => setGender(value)}
                >
                  {value}
                </Select.Option>
              );
            })}
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

export const ChangeAgeButton = ({
  store,
}: {
  store: ModifyUserInfoFormStore;
}) => {
  const age = useStore(store, (state) => state.age);
  const setAge = useStore(store, (state) => state.setAge);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={settingClassName} onClick={() => setIsOpen(true)}>
        <span>나이대 변경</span>
        <span className="flex items-center">
          <span className="text-grey-700">{age}</span>
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
            {ageRangeOptionList.map((value) => {
              return (
                <Select.Option
                  key={value}
                  value={value}
                  isSelected={value === age}
                  onClick={() => setAge(value)}
                >
                  {value}
                </Select.Option>
              );
            })}
          </Select.OptionList>
        </Select.BottomSheet>
      </Select>
    </>
  );
};

export const ChangeRegionButton = ({
  store,
}: {
  store: ModifyUserInfoFormStore;
}) => {
  const region = useStore(store, (state) => state.region);
  const setRegion = useStore(store, (state) => state.setRegion);

  const { handleOpen, onClose } = useModal(() => (
    <RegionModal onClose={onClose} externalFormStore={store} />
  ));

  const handleRemove = (id: Region["id"]) => {
    setRegion(region.filter((region) => region.id !== id));
  };

  return (
    <section>
      <button className={settingClassName} onClick={handleOpen}>
        <span>동네 설정</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </button>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {region.map(({ id, address }) => (
          <li className="flex flex-shrink-0" key={id}>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={true}
              onClick={() => handleRemove(id)}
            >
              {address}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};
