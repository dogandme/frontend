import { useState } from "react";
import { ageRangeMap } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { PutChangeAgeRequestData, usePutChangeAge } from "../api/putChageAge";

// TODO useQuery 옮기고 isLoading 동안 disabled 시키기
export const ChangeAgeButton = ({ age }: Pick<MyInfo, "age">) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: putChangeAge, isPending } = usePutChangeAge();

  return (
    <>
      <button
        className="setting-item"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
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
        age={age}
      />
    </>
  );
};

interface ChangeAgeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  putChangeAge: ({ age, token }: PutChangeAgeRequestData) => void;
  age: keyof typeof ageRangeMap;
}

const ChangeAgeBottomSheet = ({
  isOpen,
  putChangeAge,
  onClose,
  age,
}: ChangeAgeBottomSheetProps) => {
  return (
    <Select isOpen={isOpen} onClose={onClose}>
      <Select.BottomSheet>
        <Select.OptionList>
          {Object.entries(ageRangeMap).map(([key, value]) => {
            return (
              <Select.Option
                key={key}
                value={key}
                isSelected={key === age}
                onClick={() => {
                  putChangeAge({
                    age: key as keyof typeof ageRangeMap,
                    token: useAuthStore.getState().token!,
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
