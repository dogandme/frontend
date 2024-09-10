import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useSnackBar } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store/auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Snackbar } from "@/shared/ui/snackbar";
import {
  usePostCheckVerificationCode,
  usePostSignUpByEmail,
  usePostVerificationCode,
} from "../api";
import { validateEmail, validatePassword } from "../lib";
import { useSignUpByEmailFormStore } from "../store";

const Email = () => {
  const [isFocusedEmailInput, setIsFocusedEmailInput] =
    useState<boolean>(false);

  // ! email.length = 0이면 [코드 전송] 버튼 비활성화해야 하기 때문에, email 구독
  const email = useSignUpByEmailFormStore((state) => state.email);
  const setEmail = useSignUpByEmailFormStore((state) => state.setEmail);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: email } = e.target;

    setEmail(email);
  };

  const isEmailEmpty = email.length === 0;
  const isValidEmail = validateEmail(email);

  // todo: error code에 따라 status text 변경
  const {
    mutate: postVerificationCode,
    isError,
    variables,
  } = usePostVerificationCode();

  const isDuplicateEmail = isError && variables?.email === email;

  const shouldShowEmailStatusText =
    isFocusedEmailInput || (!isValidEmail && !isEmailEmpty) || isDuplicateEmail;

  const { handleOpen, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>메일로 인증코드가 전송되었습니다</Snackbar>
  ));

  const statusTextColorStyle = isDuplicateEmail
    ? "text-pink-500"
    : isValidEmail || isEmailEmpty
      ? "text-grey-500"
      : "text-pink-500";
  const statusText = isDuplicateEmail
    ? "이미 가입된 이메일 입니다"
    : "이메일 형식으로 입력해 주세요";

  return (
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
          disabled={!isValidEmail || isEmailEmpty || isDuplicateEmail}
          onClick={() => {
            handleOpen();
            postVerificationCode({ email });
          }}
        >
          코드전송
        </Button>
      </div>
      {shouldShowEmailStatusText && (
        <p className={`body-3 pl-1 pr-3 pt-1 h-6 ${statusTextColorStyle}`}>
          {statusText}
        </p>
      )}
    </div>
  );
};

const VerificationCode = () => {
  const email = useSignUpByEmailFormStore((state) => state.email);

  const verificationCode = useSignUpByEmailFormStore(
    (state) => state.verificationCode,
  );
  const setVerificationCode = useSignUpByEmailFormStore(
    (state) => state.setVerificationCode,
  );
  const setIsVerificationCodeCorrect = useSignUpByEmailFormStore(
    (state) => state.setIsVerificationCodeCorrect,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: verificationCode } = e.target;

    const isNumber = /^[0-9]*$/.test(verificationCode);

    if (isNumber) {
      setVerificationCode(verificationCode);
    }
  };

  const isEmptyEmail = email.length === 0;
  const isValidEmail = validateEmail(email);

  // todo: error code에 따라 status text 변경
  const {
    mutate: postCheckCode,
    isError,
    isSuccess,
  } = usePostCheckVerificationCode();

  const CODE_LENGTH = 7;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;

    postCheckCode(
      { email, authNum: value },
      {
        onSuccess: () => {
          setIsVerificationCodeCorrect(true);
        },
        onError: () => {
          setIsVerificationCodeCorrect(false);
        },
      },
    );
  };

  let statusText = "";

  if (verificationCode.length === 0)
    statusText = "인증코드 7자리를 입력해 주세요";
  if (isSuccess) statusText = "인증되었습니다";
  if (isError) statusText = "인증코드를 다시 확인해 주세요";

  return (
    <div>
      <Input
        componentType="outlinedText"
        id="verification-code"
        name="verificationCode"
        type="text"
        placeholder="인증코드 7자리를 입력해 주세요"
        statusText={undefined}
        maxLength={CODE_LENGTH}
        value={verificationCode}
        onChange={handleChange}
        isError={isError}
        disabled={isEmptyEmail || !isValidEmail}
        onBlur={handleBlur}
      />
      <p
        className={`body-3 pl-1 pr-3 pt-1 h-6 ${isError ? "text-pink-500" : "text-grey-500"}`}
      >
        {statusText}
      </p>
    </div>
  );
};

const Password = () => {
  const password = useSignUpByEmailFormStore((state) => state.password);
  const setPassword = useSignUpByEmailFormStore((state) => state.setPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: password } = e.target;

    setPassword(password);
  };

  const isPasswordEmpty = password.length === 0;
  const isValidPassword = validatePassword(password);

  const statusText = isPasswordEmpty
    ? "비밀번호를 입력해 주세요"
    : isValidPassword
      ? ""
      : "비밀번호 형식에 맞게 입력해 주세요";

  return (
    <PasswordInput
      id="password"
      label="비밀번호"
      name="password"
      placeholder="비밀번호를 입력해 주세요"
      statusText={statusText}
      essential
      onChange={handleChange}
      isError={!isValidPassword && !isPasswordEmpty}
    />
  );
};

const PasswordConfirm = () => {
  const password = useSignUpByEmailFormStore((state) => state.password);
  const passwordConfirm = useSignUpByEmailFormStore(
    (state) => state.passwordConfirm,
  );
  const setPasswordConfirm = useSignUpByEmailFormStore(
    (state) => state.setPasswordConfirm,
  );

  const isPasswordConfirmEmpty = passwordConfirm.length === 0;

  const isValidPassword = validatePassword(password);
  const isPasswordMatched = password === passwordConfirm;

  let statusText = "";

  if (isValidPassword) {
    if (isPasswordMatched) statusText = "사용가능한 비밀번호 입니다";
    else statusText = "비밀번호가 서로 일치하지 않습니다";
  } else {
    if (isPasswordMatched) statusText = "";
    else statusText = "비밀번호가 서로 일치하지 않습니다";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: passwordConfirm } = e.target;

    setPasswordConfirm(passwordConfirm);
  };

  return (
    <>
      <div>
        <PasswordInput
          id="password-confirm"
          name="passwordConfirm"
          placeholder="비밀번호를 다시 한번 입력해 주세요"
          statusText={undefined}
          essential
          value={passwordConfirm}
          onChange={handleChange}
          isError={!isPasswordConfirmEmpty && !isPasswordMatched}
        />
        <p
          className={`body-3 pl-1 pr-3 pt-1 h-6 ${!isPasswordConfirmEmpty && !isPasswordMatched ? "text-pink-500" : "text-grey-500"}`}
        >
          {isPasswordConfirmEmpty ? "" : statusText}
        </p>
      </div>
      <span className="body-3 px-3 pt-1 text-grey-500">
        영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로 입력해
        주세요.
      </span>
    </>
  );
};

const SignUpByEmailForm = () => {
  const navigate = useNavigate();

  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, passwordConfirm, isVerificationCodeCorrect } =
      useSignUpByEmailFormStore.getState();

    const isEmailEmpty = email.length === 0;
    const isPasswordEmpty = password.length === 0;
    const isPasswordConfirmEmpty = passwordConfirm.length === 0;

    if (isEmailEmpty || isPasswordEmpty || isPasswordConfirmEmpty) {
      // todo: snackbar 띄우기
      alert("이메일 또는 비밀번호를 입력해 주세요");
      return;
    }

    const isMatchedPassword = password === passwordConfirm;

    const isValidEmailAndPassword =
      validateEmail(email) && validatePassword(password) && isMatchedPassword;

    if (!isValidEmailAndPassword) {
      // todo: snackbar 띄우기
      alert("이메일 또는 비밀번호를 올바르게 입력해 주세요");
      return;
    }

    const canSignUp =
      validateEmail(email) &&
      validatePassword(password) &&
      isMatchedPassword &&
      isVerificationCodeCorrect;

    if (canSignUp)
      postSignUpByEmail(
        { email, password },
        {
          onSuccess: ({ content }) => {
            const { authorization, role } = content;

            setToken(authorization);
            setRole(role);

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
        <Email />
        <VerificationCode />
      </div>

      <div>
        <Password />
        <PasswordConfirm />
      </div>

      <Button type="submit" colorType="primary" variant="filled" size="large">
        다음
      </Button>
    </form>
  );
};

export default SignUpByEmailForm;
