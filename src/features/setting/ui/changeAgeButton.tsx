import { useState } from "react";
import { AGE_RANGE_MAP } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { PutChangeAgeRequestData, usePutChangeAge } from "../api";

// TODO useQuery 옮기고 isLoading 동안 disabled 시키기
export const ChangeAgeButton = ({ age }: Pick<MyInfo, "age">) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending } = usePutChangeAge();

  const putChangeAge = ({ age: newAge, token }: PutChangeAgeRequestData) => {
    if (newAge === age) {
      setIsOpen(false);
      return;
    }
    mutate({ age: newAge, token });
  };

  return (
    <>
      <button
        className="setting-item"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        <span>나이대 변경</span>
        <div className="flex items-center text-grey-500">
          <span className="body-2">{AGE_RANGE_MAP[age]}</span>
          <ArrowRightIcon />
        </div>
      </button>
      <ChangeAgeBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        putChangeAge={putChangeAge}
        isSelected={(key) => key === age}
      />
    </>
  );
};

interface ChangeAgeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  putChangeAge: ({ age, token }: PutChangeAgeRequestData) => void;
  isSelected: (key: keyof typeof AGE_RANGE_MAP) => boolean;
}

const ChangeAgeBottomSheet = ({
  isOpen,
  putChangeAge,
  onClose,
  isSelected,
}: ChangeAgeBottomSheetProps) => {
  return (
    <Select isOpen={isOpen} onClose={onClose}>
      <Select.BottomSheet>
        <Select.OptionList>
          {Object.entries(AGE_RANGE_MAP).map(([key, ageRange]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                isSelected={isSelected(key as keyof typeof AGE_RANGE_MAP)}
                onClick={() => {
                  putChangeAge({
                    age: key as keyof typeof AGE_RANGE_MAP,
                    token: useAuthStore.getState().token!,
                  });
                }}
              >
                {ageRange}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select.BottomSheet>
    </Select>
  );
};
