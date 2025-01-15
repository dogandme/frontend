import { forwardRef, useState } from "react";
import { VisibilityOffIcon, VisibilityOnIcon } from "@/shared/ui/icon";
import { Input, type InputProps } from "@/shared/ui/input";

type FixedInputProps = "type" | "componentType";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, FixedInputProps>
>((props, ref) => {
  const [isVisibilityOn, setIsVisibilityOn] = useState<boolean>(false);

  const handleVisibility = () => {
    setIsVisibilityOn((prev) => !prev);
  };

  return (
    <Input
      ref={ref}
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
});
