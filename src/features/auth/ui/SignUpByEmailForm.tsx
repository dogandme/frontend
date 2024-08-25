import { useState } from "react";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useSignUpByEmailForm } from "../model";

const SignUpByEmailForm = () => {
  const [isFocusedEmailInput, setIsFocusedEmailInput] =
    useState<boolean>(false);

  const { form, handleChange } = useSignUpByEmailForm();
  const { email, confirmCode, password, passwordConfirm } = form;

  return (
    <form className="flex flex-col gap-8 self-stretch">
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex items-end justify-between gap-2">
            <EmailInput
              id="email"
              name="email"
              label="이메일"
              placeholder="이메일을 입력해 주세요"
              statusText={undefined}
              essential
              onFocus={() => setIsFocusedEmailInput(true)}
              onBlur={() => setIsFocusedEmailInput(false)}
              value={email}
              onChange={handleChange}
            />
            <Button
              type="button"
              colorType="secondary"
              variant="filled"
              size="medium"
              fullWidth={false}
            >
              코드전송
            </Button>
          </div>
          {isFocusedEmailInput && (
            <p className="body-3 pl-1 pr-3 pt-1 text-grey-500">
              이메일 형식으로 입력해 주세요
            </p>
          )}
        </div>

        <Input
          componentType="outlinedText"
          id="confirm-code"
          name="confirmCode"
          type="text"
          placeholder="인증코드 7자리를 입력해 주세요"
          statusText="인증코드 7자리를 입력해 주세요"
          value={confirmCode}
          onChange={handleChange}
        />
      </div>

      <div>
        <PasswordInput
          id="password"
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력해 주세요"
          statusText="비밀번호를 입력해 주세요"
          essential
          isError={false}
          value={password}
          onChange={handleChange}
        />
        <PasswordInput
          id="password-confirm"
          name="passwordConfirm"
          placeholder="비밀번호를 다시 한번 입력해 주세요"
          statusText="비밀번호를 다시 한번 입력해 주세요"
          essential
          isError={false}
          value={passwordConfirm}
          onChange={handleChange}
        />
        <span className="body-3 px-3 pt-1 text-grey-500">
          영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로 입력해
          주세요.
        </span>
      </div>

      <Button type="submit" colorType="primary" variant="filled" size="large">
        다음
      </Button>
    </form>
  );
};

export default SignUpByEmailForm;
