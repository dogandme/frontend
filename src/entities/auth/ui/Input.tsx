import { useState } from "react";
import { VisibilityOffIcon, VisibilityOnIcon } from "@/shared/ui/icon";
import { Input, InputProps } from "@/shared/ui/input/Input";

type FixedInputProps = "type" | "componentType";

export const EmailInput = (props: Omit<InputProps, FixedInputProps>) => (
  <Input
    type="text"
    placeholder="이메일을 입력해주세요"
    componentType="outlinedText"
    {...props}
  />
);

export const PasswordInput = (props: Omit<InputProps, FixedInputProps>) => {
  const [isVisibilityOn, setIsVisibilityOn] = useState<boolean>(false);

  const handleVisibility = () => {
    setIsVisibilityOn((prev) => !prev);
  };

  return (
    <Input
      componentType="outlinedText"
      type={isVisibilityOn ? "text" : "password"}
      trailingNode={
        <button
          onClick={handleVisibility}
          aria-label="비밀번호 보기 버튼"
          aria-pressed={isVisibilityOn}
          title={isVisibilityOn ? "비밀번호 숨기기" : "비밀번호 보기"}
          type="button"
        >
          {isVisibilityOn ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
        </button>
      }
      placeholder="비밀번호를 입력해 주세요"
      {...props}
    />
  );
};
