import { useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { ageRangeMap } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { PutChangeAgeRequestData, usePutChangeAge } from "../api";

// TODO useQuery 옮기고 isLoading 동안 disabled 시키기
export const ChangeAgeButton = ({ age }: Pick<MyInfo, "age">) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = usePutChangeAge();

  const putChangeAge = ({ age: newAge, token }: PutChangeAgeRequestData) => {
    if (newAge === age) {
      setIsOpen(false);
      return;
    }
    mutate({ age: newAge, token });
  };

  const isBottomSheetMutating =
    useIsMutating({
      mutationKey: ["bottomSheetMutating"],
      exact: false,
    }) > 0;

  return (
    <>
      <button
        className="setting-item"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isBottomSheetMutating}
      >
        <span>나이대 변경</span>
        <div className="flex items-center text-grey-500">
          <span className="body-2">{ageRangeMap[age]}</span>
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
  isSelected: (key: string) => boolean;
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
          {Object.entries(ageRangeMap).map(([key, ageRange]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                isSelected={isSelected(key)}
                onClick={() => {
                  putChangeAge({
                    age: key as keyof typeof ageRangeMap,
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
