import { forwardRef, useState } from "react";
import { useAuthStore } from "@/shared/store";
import { Input } from "@/shared/ui/input";
import { usePostCheckDuplicateNickname } from "../api";
import { validateNickname } from "../lib";

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
      mutate: postDuplicateNickname,
      isError,
      isSuccess,
      variables,
    } = usePostCheckDuplicateNickname();

    // todo 409 응답코드이면 중복된 닉네임으로 판단
    const isDuplicateNickname = isError && variables?.nickname === nickname;
    const isValidNickname = validateNickname(nickname) && !isDuplicateNickname;
    const isNicknameEmpty = nickname.length === 0;
    const isEnableNickname =
      isValidNickname && variables?.nickname === nickname && isSuccess;

    const handleBlur = () => {
      if (!token || !isValidNickname || isNicknameEmpty) return;

      postDuplicateNickname({ nickname });
    };

    let statusText = "20자 이내의 한글 영어 숫자만 사용 가능합니다.";

    if (isDuplicateNickname) {
      statusText = "이미 존재하는 닉네임입니다.";
    }
    if (isEnableNickname) {
      statusText = "사용 가능한 닉네임입니다.";
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
