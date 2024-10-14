import { forwardRef, useState } from "react";
import { useAuthStore } from "@/shared/store";
import { Input } from "@/shared/ui/input";
import { usePostDuplicateNickname } from "../api";
import { validateNickname } from "../lib";

/**
 * 닉네임 유효성 검사 결과를 반환하는 훅
 * 여기서만 사용되는 훅으로 별도의 파일로 분리하지 않았습니다.
 *
 * @param nickname 닉네임 값
 * @returns isValidNickname: 닉네임이 유효한지 여부
 * @returns isDuplicateNickname: 중복된 닉네임인지 여부
 * @returns isNicknameEmpty: 닉네임이 비어있는지 여부
 * @returns checkDuplicateNickname: 닉네임 중복 검사 함수
 */
const useValidateNickname = (nickname: string) => {
  const {
    mutate: postDuplicateNickname,
    isError,
    variables,
  } = usePostDuplicateNickname();

  const isDuplicateNickname = isError && variables?.nickname === nickname;
  const isValidNickname = validateNickname(nickname) && !isDuplicateNickname;
  const isNicknameEmpty = nickname.length === 0;

  return {
    isValidNickname,
    isDuplicateNickname,
    isNicknameEmpty,
    checkDuplicateNickname: postDuplicateNickname,
  };
};

interface NicknameInputProps {
  nickname?: string;
  onChange?: (nickname: string) => void;
}

export const NicknameInput = forwardRef<HTMLInputElement, NicknameInputProps>(
  ({ nickname: controlledNickname, onChange }, ref) => {
    const isControlled = typeof controlledNickname !== "undefined";

    const token = useAuthStore((state) => state.token);
    const [nickname, setNickname] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setNickname(e.target.value);
      }

      onChange?.(e.target.value);
    };

    const {
      isValidNickname,
      isDuplicateNickname,
      isNicknameEmpty,
      checkDuplicateNickname,
    } = useValidateNickname(nickname);

    const handleBlur = () => {
      if (!token || !isValidNickname || isNicknameEmpty) return;

      checkDuplicateNickname({ token, nickname });
    };

    let statusText = "20자 이내의 한글 영어 숫자만 사용 가능합니다.";

    if (isDuplicateNickname) {
      statusText = "이미 존재하는 닉네임입니다.";
    }

    return (
      <Input
        ref={ref}
        type="text"
        id="nickname"
        name="nickname"
        label="닉네임"
        placeholder="닉네임을 입력해 주세요"
        statusText={statusText}
        essential
        componentType="outlinedText"
        isError={!isValidNickname && !isNicknameEmpty}
        value={isControlled ? controlledNickname : nickname}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={20}
        trailingNode={
          <ValueLength
            value={isControlled ? controlledNickname : nickname}
            maxLength={20}
          />
        }
      />
    );
  },
);

const ValueLength = ({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) => {
  return (
    <div className="flex gap-[.125rem] body-3">
      <span className="text-grey-500">{value.length}</span>
      <span className="text-grey-300">/</span>
      <span className="text-grey-500">{maxLength}</span>
    </div>
  );
};
