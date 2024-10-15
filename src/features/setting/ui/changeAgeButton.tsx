import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ageRangeMap } from "@/features/auth/constants";
import type { MyInfo } from "@/entities/auth/api";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { Select } from "@/shared/ui/select";
import { PutChangeAgeRequestData, usePutChangeAge } from "../api";

// TODO useQuery 옮기고 isLoading 동안 disabled 시키기
export const ChangeAgeButton = ({ age }: Pick<MyInfo, "age">) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = usePutChangeAge();

  const putChangeAge = ({ age: newAge, token }: PutChangeAgeRequestData) => {
    if (newAge === age) {
      setIsOpen(false);
      return;
    }
    mutate({ age: newAge, token });
  };

  useEffect(() => {
    /** 낙관적 업데이트 이후 뮤테이션이 pending 상태일 때 언마운트 되게 된다면 데이터의 무결성을 위해 invalidateQueries를 호출해야 합니다.
     * 이 작업은 myInfo 쿼리의 staleTime이 늘어날 것임을 기대하고 한 작업입니다.
     */
    return () => {
      const isPending =
        queryClient.getMutationCache().find({
          mutationKey: ["putChangeAge"],
          exact: false,
        })?.state.status === "pending";

      if (isPending) {
        queryClient.invalidateQueries({
          queryKey: ["myInfo"],
        });
      }
    };
  }, []);

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
