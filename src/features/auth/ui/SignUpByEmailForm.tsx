import { useEffect, useRef, useState } from "react";
import { MutationState, useMutationState } from "@tanstack/react-query";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Snackbar } from "@/shared/ui/snackbar";
import {
  CheckVerificationCodeRequestData,
  CheckVerificationCodeResponse,
  usePostCheckVerificationCode,
  usePostSignUpByEmail,
  usePostVerificationCode,
} from "../api";
import { useSignUpByEmailFormStore } from "../store";

const Email = () => {
  const { handleOpen, onClose } = useSnackBar(() => (
    <Snackbar onClose={onClose}>메일로 인증코드가 전송되었습니다</Snackbar>
  ));

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isEmailEmpty = useSignUpByEmailFormStore((state) => state.isEmailEmpty);
  const isValidEmail = useSignUpByEmailFormStore((state) => state.isValidEmail);
  const hasEmailChangedSinceSendCodeRequest = useSignUpByEmailFormStore(
    (state) => state.hasEmailChangedSinceSendCodeRequest,
  );
  const isTimeLeftLessThanOneMinute = useSignUpByEmailFormStore(
    (state) => state.isTimeLeftLessThanOneMinute,
  );
  const setEmail = useSignUpByEmailFormStore((state) => state.setEmail);
  const setHasEmailChangedSinceCodeRequest = useSignUpByEmailFormStore(
    (state) => state.setHasEmailChangedSinceSendCodeRequest,
  );
  const setTimeLeft = useSignUpByEmailFormStore((state) => state.setTimeLeft);

  const {
    mutate: postVerificationCode,
    isError: isErrorSendCode,
    isSuccess: isSuccessSendCode,
    isIdle: isIdleSendCode,
    variables,
  } = usePostVerificationCode();

  const checkCodeResponseCacheArr = useMutationState({
    filters: {
      mutationKey: ["checkVerificationCode"],
    },
  });
  const checkCodeStatus =
    checkCodeResponseCacheArr[checkCodeResponseCacheArr.length - 1]?.status;
  const isSuccessCheckCode = checkCodeStatus === "success";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: email } = e.target;

    setEmail(email);
    setHasEmailChangedSinceCodeRequest(
      typeof variables !== "undefined" && variables.email !== email,
    );
  };

  const isDuplicateEmail =
    isErrorSendCode && !hasEmailChangedSinceSendCodeRequest;

  const canNotResendCode =
    isSuccessSendCode &&
    !hasEmailChangedSinceSendCodeRequest &&
    (!isTimeLeftLessThanOneMinute || isSuccessCheckCode);

  const handleSendVerificationCode = () => {
    const { email } = useSignUpByEmailFormStore.getState();

    handleOpen();
    postVerificationCode(
      { email },
      {
        onSuccess: () => {
          setTimeLeft(1000 * 60 * 3);
          setHasEmailChangedSinceCodeRequest(false);
        },
      },
    );
  };

  const shouldShowEmailStatusText =
    isFocused ||
    isValidEmail ||
    (!isValidEmail && !isEmailEmpty) ||
    isDuplicateEmail;

  const statusTextColorStyle = isDuplicateEmail
    ? "text-pink-500"
    : isValidEmail || isEmailEmpty
      ? "text-grey-500"
      : "text-pink-500";

  const statusText = !isValidEmail
    ? "이메일 형식으로 입력해 주세요"
    : isDuplicateEmail
      ? "이미 가입된 이메일 입니다"
      : "올바른 이메일 형식입니다";

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <EmailInput
          id="email"
          name="email"
          label="이메일"
          disabled={isSuccessCheckCode}
          isError={(!isEmailEmpty && !isValidEmail) || isDuplicateEmail}
          placeholder="이메일을 입력해 주세요"
          statusText={undefined}
          essential
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isIdleSendCode ? (
          <Button
            type="button"
            colorType="secondary"
            variant="filled"
            size="medium"
            fullWidth={false}
            className="w-[6.5rem]"
            onClick={handleSendVerificationCode}
            disabled={!isValidEmail || isDuplicateEmail || isSuccessCheckCode}
          >
            코드전송
          </Button>
        ) : (
          <Button
            type="button"
            colorType="secondary"
            variant="filled"
            size="medium"
            fullWidth={false}
            className="w-[6.5rem]"
            onClick={handleSendVerificationCode}
            disabled={
              !isValidEmail ||
              isDuplicateEmail ||
              isSuccessCheckCode ||
              canNotResendCode
            }
          >
            재전송
          </Button>
        )}
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
  const timeLeft = useSignUpByEmailFormStore((state) => state.timeLeft);
  const setTimeLeft = useSignUpByEmailFormStore((state) => state.setTimeLeft);
  const isValidEmail = useSignUpByEmailFormStore((state) => state.isValidEmail);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const CODE_LENGTH = 7;
  const INTERVAL = 1000;

  const {
    mutate: postCheckCode,
    isError: isErrorCheckCode,
    isSuccess: isSuccessCheckCode,
    variables,
  } = usePostCheckVerificationCode();

  // 인증 코드 전송 요청에 대한 응답 캐시
  const sendCodeResponseCacheArr = useMutationState({
    filters: {
      mutationKey: ["sendVerificationCode"],
    },
  });

  const sendCodeStatus =
    sendCodeResponseCacheArr[sendCodeResponseCacheArr.length - 1]?.status;
  const isCodeNotSent = !sendCodeStatus;
  const isErrorSendCode = sendCodeStatus === "error";
  const isSuccessSendCode = sendCodeStatus === "success";

  const hasEmailChangedSinceCodeCheckRequest = variables?.email !== email;
  const hasCodeChangedSinceCodeCheckRequest =
    variables?.authNum !== verificationCode;

  // 인증 코드 입력 시간이 만료되었을 경우 (= 코드 전송 후, timeLeft가 0이 되었을 때)
  const isTimeOver = timeLeft === 0 && isSuccessSendCode;
  // 인증 코드가 일치하지 않을 경우
  const isCodeNotMatched =
    isErrorCheckCode && !hasCodeChangedSinceCodeCheckRequest;
  const isError = isTimeOver || isCodeNotMatched;

  // 인증 코드가 일치하는 경우 (단, 인증 코드 체크 이후 이메일과 인증 코드를 바꾸지 않아야 함)
  const isSuccess =
    isSuccessCheckCode &&
    !hasEmailChangedSinceCodeCheckRequest &&
    !hasCodeChangedSinceCodeCheckRequest;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: verificationCode } = e.target;

    const isNumber = /^[0-9]*$/.test(verificationCode);

    if (isNumber) {
      setVerificationCode(verificationCode);
    }
  };

  const handleCheckButtonClick = () => {
    postCheckCode(
      { email, authNum: verificationCode },
      {
        onError: () => {
          ref.current?.focus();
        },
      },
    );
  };

  useEffect(() => {
    if (!isSuccessSendCode || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - INTERVAL);
    }, INTERVAL);

    if (isTimeOver) {
      setVerificationCode("");
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [
    timeLeft,
    setTimeLeft,
    isSuccessSendCode,
    setVerificationCode,
    isTimeOver,
    isSuccess,
  ]);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0",
  );
  const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  let statusText = "인증코드 7자리를 입력해 주세요";
  if (isSuccess) statusText = "인증되었습니다";
  if (isCodeNotMatched) statusText = "인증코드를 다시 확인해 주세요";
  if (isTimeOver)
    statusText = "인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요";

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <Input
          ref={ref}
          componentType="outlinedText"
          id="verification-code"
          name="verificationCode"
          type="text"
          placeholder="인증코드 7자리를 입력해 주세요"
          statusText={undefined}
          maxLength={CODE_LENGTH}
          value={verificationCode}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          isError={isError}
          disabled={!isValidEmail || isErrorSendCode || isCodeNotSent}
          trailingNode={
            isSuccessSendCode &&
            !isSuccessCheckCode && (
              <span
                className={`body-2 ${isTimeOver ? "text-pink-500" : "text-grey-700"}`}
              >
                {minutes}:{seconds}
              </span>
            )
          }
        />
        <Button
          type="button"
          colorType="secondary"
          variant="filled"
          size="medium"
          fullWidth={false}
          className="w-[6.5rem]"
          onClick={handleCheckButtonClick}
          disabled={
            !isValidEmail ||
            isError ||
            verificationCode.length < CODE_LENGTH ||
            isSuccess
          }
        >
          확인
        </Button>
      </div>
      <p
        className={`body-3 pl-1 pr-3 pt-1 h-6 ${isError ? "text-pink-500" : "text-grey-500"}`}
      >
        {(isFocused || isSuccess || isError) && statusText}
      </p>
    </div>
  );
};

const Password = () => {
  const setPassword = useSignUpByEmailFormStore((state) => state.setPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: password } = e.target;

    setPassword(password);
  };

  const isPasswordEmpty = useSignUpByEmailFormStore(
    (state) => state.isPasswordEmpty,
  );
  const isValidPassword = useSignUpByEmailFormStore(
    (state) => state.isValidPassword,
  );

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
  const passwordConfirm = useSignUpByEmailFormStore(
    (state) => state.confirmPassword,
  );
  const setPasswordConfirm = useSignUpByEmailFormStore(
    (state) => state.setConfirmPassword,
  );

  const isConfirmPasswordEmpty = useSignUpByEmailFormStore(
    (state) => state.isConfirmPasswordEmpty,
  );

  const isValidPassword = useSignUpByEmailFormStore(
    (state) => state.isValidPassword,
  );
  const isValidConfirmPassword = useSignUpByEmailFormStore(
    (state) => state.isValidConfirmPassword,
  );

  let statusText = "";

  if (isValidPassword) {
    if (isValidConfirmPassword) statusText = "사용가능한 비밀번호 입니다";
    else statusText = "비밀번호가 서로 일치하지 않습니다";
  } else {
    if (isValidConfirmPassword) statusText = "";
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
          isError={!isConfirmPasswordEmpty && !isValidConfirmPassword}
        />
        <p
          className={`body-3 pl-1 pr-3 pt-1 h-6 ${!isConfirmPasswordEmpty && !isValidConfirmPassword ? "text-pink-500" : "text-grey-500"}`}
        >
          {isConfirmPasswordEmpty ? "" : statusText}
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
  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();

  const checkCodeResponseCacheArr = useMutationState<
    MutationState<
      CheckVerificationCodeResponse,
      Error,
      CheckVerificationCodeRequestData
    >
  >({
    filters: {
      mutationKey: ["checkVerificationCode"],
    },
  });

  const {
    handleOpen: handleEmptyFieldsSnackBar,
    onClose: onCloseEmptyFieldsSnackBar,
  } = useSnackBar(() => (
    <Snackbar onClose={onCloseEmptyFieldsSnackBar}>
      이메일과 비밀번호를 모두 입력해 주세요
    </Snackbar>
  ));
  const {
    handleOpen: handleValidFieldsSnackBar,
    onClose: onCloseValidFieldsSnackBar,
  } = useSnackBar(() => (
    <Snackbar onClose={onCloseValidFieldsSnackBar}>
      이메일 또는 비밀번호를 올바르게 입력해 주세요
    </Snackbar>
  ));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      email,
      password,
      isEmailEmpty,
      isPasswordEmpty,
      isConfirmPasswordEmpty,
      isValidEmail,
      isValidPassword,
      isValidConfirmPassword,
    } = useSignUpByEmailFormStore.getState();

    if (isEmailEmpty || isPasswordEmpty || isConfirmPasswordEmpty) {
      handleEmptyFieldsSnackBar();
      return;
    }

    const isValidEmailAndPassword =
      isValidEmail && isValidPassword && isValidConfirmPassword;

    if (!isValidEmailAndPassword) {
      handleValidFieldsSnackBar();
      return;
    }

    // 인증 코드 확인 요청에 대한 마지막 응답
    const lastCheckCodeResponse =
      checkCodeResponseCacheArr[checkCodeResponseCacheArr.length - 1];
    const hasEmailChangedSinceCodeCheckRequest =
      lastCheckCodeResponse.variables?.email !== email;

    if (hasEmailChangedSinceCodeCheckRequest) {
      alert("인증코드를 확인해 주세요");
      return;
    }

    const isVerificationCodeCorrect =
      lastCheckCodeResponse.status === "success";

    if (!isVerificationCodeCorrect) {
      // todo: snackbar 띄우기
      alert("인증코드를 확인해 주세요");
      return;
    }

    const canSignUp =
      isValidEmail &&
      isValidPassword &&
      isValidConfirmPassword &&
      isVerificationCodeCorrect;

    if (canSignUp) postSignUpByEmail({ email, password });
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
