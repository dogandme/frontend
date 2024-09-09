import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store/auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { usePostSignUpByEmail } from "../api";
import { useSignUpByEmailForm } from "../model";

const SignUpByEmailForm = () => {
  const navigate = useNavigate();

  const [isFocusedEmailInput, setIsFocusedEmailInput] =
    useState<boolean>(false);

  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);

  const {
    form,
    handleChange,
    isValidEmail,
    isValidPassword,
    isPasswordMatched,
  } = useSignUpByEmailForm();
  const { email, confirmCode, password, passwordConfirm } = form;

  const isEmailEmpty = email.length === 0;
  const isPasswordEmpty = password.length === 0;
  const isPasswordConfirmEmpty = passwordConfirm.length === 0;

  const shouldShowEmailStatusText =
    (!isValidEmail && !isEmailEmpty) || isFocusedEmailInput;

  let passwordConfirmStatusText = "";

  if (isValidPassword) {
    if (isPasswordMatched)
      passwordConfirmStatusText = "사용가능한 비밀번호 입니다";
    else passwordConfirmStatusText = "비밀번호가 서로 일치하지 않습니다";
  } else {
    if (isPasswordMatched) passwordConfirmStatusText = "";
    else passwordConfirmStatusText = "비밀번호가 서로 일치하지 않습니다";
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const canSignUp = isValidEmail && isValidPassword && isPasswordMatched;

    if (!canSignUp) {
      // todo: snackbar 띄우기
      alert("이메일과 비밀번호를 모두 입력해 주세요");
      return;
    }

    postSignUpByEmail(
      { email, password },
      {
        onSuccess: ({ content }) => {
          const { authorization, role, userId } = content;

          setToken(authorization);
          setRole(role);
          setUserId(userId);

          navigate(ROUTER_PATH.SIGN_UP_USER_INFO);
        },
        onError: (error) => {
          // todo: snackbar 띄우기
          alert(error.message);
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-8 self-stretch" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex items-end justify-between gap-2">
            <EmailInput
              id="email"
              name="email"
              label="이메일"
              isError={!isEmailEmpty && !isValidEmail}
              placeholder="이메일을 입력해 주세요"
              statusText={undefined}
              essential
              value={email}
              onChange={handleChange}
              onFocus={() => setIsFocusedEmailInput(true)}
              onBlur={() => setIsFocusedEmailInput(false)}
            />
            <Button
              type="button"
              colorType="secondary"
              variant="filled"
              size="medium"
              fullWidth={false}
              disabled={!isValidEmail}
            >
              코드전송
            </Button>
          </div>
          {shouldShowEmailStatusText && (
            <p
              className={`body-3 pl-1 pr-3 pt-1 ${isValidEmail || isEmailEmpty ? "text-grey-500" : "text-pink-500"}`}
            >
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
          statusText={
            isPasswordEmpty
              ? "비밀번호를 입력해 주세요"
              : isValidPassword
                ? ""
                : "비밀번호 형식에 맞게 입력해 주세요"
          }
          essential
          value={password}
          onChange={handleChange}
          isError={!isPasswordEmpty && !isValidPassword}
        />
        <PasswordInput
          id="password-confirm"
          name="passwordConfirm"
          placeholder="비밀번호를 다시 한번 입력해 주세요"
          statusText={passwordConfirmStatusText}
          essential
          value={passwordConfirm}
          onChange={handleChange}
          isError={!isPasswordConfirmEmpty && !isPasswordMatched}
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
