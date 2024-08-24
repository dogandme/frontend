import { VisibilityOffIcon, VisibilityOnIcon } from "@/shared/ui/icon";
import { Input, InputProps } from "@/shared/ui/input/Input";
import { useState } from "react";

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
          tabIndex={-1}
          aria-label="visibility-control-button"
          type="button"
        >
          {isVisibilityOn ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
        </button>
      }
      placeholder="비밀번호를 입력해 주세요"
      {...props}
    />
  );
};
