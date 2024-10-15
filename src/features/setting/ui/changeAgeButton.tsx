import { useState } from "react";
import { ageOptions } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";

export const ChangeAgeButton = ({ age }: Pick<MyInfo, "age">) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="setting-item" onClick={() => setIsOpen(!isOpen)}>
        <span>나이대 변경</span>
        <div className="flex items-center text-grey-500">
          <span className="body-2">{ageOptions[age]}</span>
          <ArrowRightIcon />
        </div>
      </button>
      <ChangeAgeBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        age={age}
      />
    </>
  );
};

interface ChangeAgeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  age: number;
}

const ChangeAgeBottomSheet = ({
  isOpen,
  onClose,
  age,
}: ChangeAgeBottomSheetProps) => {
  return (
    <Select isOpen={isOpen} onClose={onClose}>
      <Select.BottomSheet>
        <Select.OptionList>
          {Object.entries(ageOptions).map(([key, value]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                isSelected={Number(key) === age}
                onClick={() => {}}
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
