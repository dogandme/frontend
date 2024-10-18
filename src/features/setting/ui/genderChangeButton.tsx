import { useState } from "react";
import { genderMap, GenderMapKey } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { PutChangeAgeRequestData, usePutChangeGender } from "../api";

export const GenderChangeButton = ({ gender }: Pick<MyInfo, "gender">) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: putChangeGender } = usePutChangeGender();

  const handleSelect = ({ gender: newGender }: PutChangeAgeRequestData) => {
    if (gender === newGender) {
      return;
    }
    putChangeGender({
      gender: newGender,
    });
  };

  return (
    <>
      <button className="setting-item" onClick={() => setIsOpen(true)}>
        <span>성별 변경</span>
        <div className="flex items-center text-grey-500">
          <span className="body-2">{genderMap[gender]}</span>
          <ArrowRightIcon />
        </div>
      </button>
      <GenderChangeBottomSheet
        isOpen={isOpen}
        isSelected={(newGender: GenderMapKey) => newGender === gender}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
};

interface GenderChangeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: ({ gender }: { gender: GenderMapKey }) => void;
  isSelected: (newGender: GenderMapKey) => boolean;
}

const GenderChangeBottomSheet = ({
  isOpen,
  onSelect,
  onClose,
  isSelected,
}: GenderChangeBottomSheetProps) => {
  return (
    <Select isOpen={isOpen} onClose={onClose}>
      <Select.BottomSheet>
        <Select.OptionList>
          {Object.entries(genderMap).map(([key, value]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                isSelected={isSelected(key as GenderMapKey)}
                onClick={() => {
                  onSelect({
                    gender: key as GenderMapKey,
                  });
                }}
              >
                {value}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select.BottomSheet>
    </Select>
  );
};
