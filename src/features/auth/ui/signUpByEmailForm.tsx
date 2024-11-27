import { useEffect, useRef } from "react";
import { EmailInput, PasswordInput } from "@/entities/auth/ui";
import { useSnackBar } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Input, StatusText } from "@/shared/ui/input";
import {
  usePostCheckCode,
  usePostSendCode,
  usePostSignUpByEmail,
} from "../api";
import { VERIFICATION_CODE_LENGTH } from "../constants";
import { useSignUpByEmailFormStore } from "../store";

const Timer = () => {
  const INTERVAL = 1000;

  const timeLeft = useSignUpByEmailFormStore((state) => state.timeLeft);
  const { setTimeLeft } = useSignUpByEmailFormStore((state) => state.actions);

  const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(
    2,
    "0",
  );
  const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - INTERVAL);
    }, INTERVAL);

    if (timeLeft === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, setTimeLeft]);

  return (
    <span
      className={`body-2 ${timeLeft === 0 ? "text-pink-500" : "text-grey-700"}`}
    >
      {minutes}:{seconds}
    </span>
  );
};

const useVerifyEmail = () => {
  const sendCodeMutation = usePostSendCode();
  const checkCodeMutation = usePostCheckCode();

  const isModifiedEmail = (email: string) =>
    email !== sendCodeMutation.variables?.email;
  const isModifiedCode = (code: string) =>
    code !== checkCodeMutation.variables?.authNum;

  const isDuplicateEmail = sendCodeMutation.error?.code === 409;
  const isSentCode = sendCodeMutation.status === "success";

  const isNotMatchedCode = checkCodeMutation.error?.code === 400;
  const isVerified = checkCodeMutation.status === "success";

  return {
    sendCodeMutation,
    checkCodeMutation,
    isModifiedEmail,
    isModifiedCode,
    isDuplicateEmail,
    isSentCode,
    isNotMatchedCode,
    isVerified,
  };
};

const VerifyEmail = () => {
  const { setTimeLeft } = useSignUpByEmailFormStore((state) => state.actions);

  const {
    sendCodeMutation,
    checkCodeMutation,
    isModifiedEmail,
    isModifiedCode,
    isDuplicateEmail,
    isSentCode,
    isNotMatchedCode,
    isVerified,
  } = useVerifyEmail();

  return (
    <>
      <div>
        <div className="flex items-end justify-between gap-2">
          <Email
            isModified={isModifiedEmail}
            isDuplicateEmail={isDuplicateEmail}
            isVerified={isVerified}
            resetCache={() => {
              sendCodeMutation.reset();
              checkCodeMutation.reset();
            }}
          />
          <SendCodeButton
            isDuplicateEmail={isDuplicateEmail}
            isSentCode={isSentCode}
            isVerified={isVerified}
            onClick={() => {
              sendCodeMutation.mutate(
                { email: useSignUpByEmailFormStore.getState().email },
                {
                  onSuccess: () => {
                    setTimeLeft(1000 * 60 * 3);
                  },
                },
              );
            }}
          />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <VerificationCode
          isModified={isModifiedCode}
          isSentCode={isSentCode}
          isVerified={isVerified}
          isNotMatchedCode={isNotMatchedCode}
          resetCache={() => {
            checkCodeMutation.reset();
          }}
        />
        <CheckCodeButton
          isSentCode={isSentCode}
          isVerified={isVerified}
          isNotMatchedCode={isNotMatchedCode}
          onClick={() => {
            const { email, verificationCode: authNum } =
              useSignUpByEmailFormStore.getState();

            checkCodeMutation.mutate({ email, authNum });
          }}
        />
      </div>
    </>
  );
};

const Email = ({
  isModified,
  isDuplicateEmail,
  isVerified,
  resetCache,
}: {
  isModified: (email: string) => boolean;
  isDuplicateEmail: boolean;
  isVerified: boolean;
  resetCache: () => void;
}) => {
  const isEmailEmpty = useSignUpByEmailFormStore((state) => state.isEmailEmpty);
  const isValidEmail = useSignUpByEmailFormStore((state) => state.isValidEmail);
  const { setEmail, resetState } = useSignUpByEmailFormStore(
    (state) => state.actions,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: email } = e.target;

    setEmail(email);

    // 이메일이 변경되면
    // 1. 인증코드, 타이머, 타이머가 1분 남았는지 여부 상태 초기화
    // 2. 캐시 초기화
    if (isModified(email)) {
      resetState([
        "verificationCode",
        "timeLeft",
        "isTimeLeftLessThanOneMinute",
      ]);
      resetCache();
    }
  };

  const statusText = !isValidEmail
    ? "이메일 형식으로 입력해 주세요"
    : isDuplicateEmail
      ? "이미 가입된 이메일 입니다"
      : "올바른 이메일 형식입니다";

  return (
    <EmailInput
      id="email"
      name="email"
      label="이메일"
      disabled={isVerified}
      isError={(!isEmailEmpty && !isValidEmail) || isDuplicateEmail}
      placeholder="이메일을 입력해 주세요"
      statusText={statusText}
      essential
      onChange={handleChange}
    />
  );
};

const SendCodeButton = ({
  isDuplicateEmail,
  isSentCode,
  isVerified,
  onClick,
}: {
  isDuplicateEmail: boolean;
  isSentCode: boolean;
  isVerified: boolean;
  onClick: () => void;
}) => {
  const isValidEmail = useSignUpByEmailFormStore((state) => state.isValidEmail);
  const isTimeLeftLessThanOneMinute = useSignUpByEmailFormStore(
    (state) => state.isTimeLeftLessThanOneMinute,
  );

  return (
    <Button
      type="button"
      colorType="secondary"
      variant="filled"
      size="medium"
      fullWidth={false}
      className="w-[6.5rem] mb-6"
      onClick={onClick}
      disabled={
        !isValidEmail ||
        isDuplicateEmail ||
        (isSentCode && !isTimeLeftLessThanOneMinute) ||
        isVerified
      }
    >
      코드전송
    </Button>
  );
};

const VerificationCode = ({
  isModified,
  isSentCode,
  isVerified,
  isNotMatchedCode,
  resetCache,
}: {
  isModified: (code: string) => boolean;
  isSentCode: boolean;
  isVerified: boolean;
  isNotMatchedCode: boolean;
  resetCache: () => void;
}) => {
  const verificationCode = useSignUpByEmailFormStore(
    (state) => state.verificationCode,
  );
  const timeLeft = useSignUpByEmailFormStore((state) => state.timeLeft);
  const { setVerificationCode } = useSignUpByEmailFormStore(
    (state) => state.actions,
  );

  const verificationCodeRef = useRef<HTMLInputElement>(null);

  const isTimeOver = timeLeft === 0 && isSentCode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: verificationCode } = e.target;

    const onlyNumbers = verificationCode.replace(/[^0-9]/g, "");

    setVerificationCode(onlyNumbers);

    if (isModified(onlyNumbers)) {
      resetCache();
    }
  };

  let statusText = "인증코드 7자리를 입력해 주세요";
  if (isVerified) statusText = "인증되었습니다";
  if (isNotMatchedCode) statusText = "인증코드를 다시 확인해 주세요";
  if (isTimeOver)
    statusText = "인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요";

  return (
    <Input
      ref={verificationCodeRef}
      componentType="outlinedText"
      id="verification-code"
      name="verificationCode"
      type="text"
      placeholder="인증코드 7자리를 입력해 주세요"
      statusText={statusText}
      maxLength={VERIFICATION_CODE_LENGTH}
      value={verificationCode}
      onChange={handleChange}
      isError={isTimeOver || isNotMatchedCode}
      disabled={!isSentCode || isVerified}
      trailingNode={isSentCode && !isVerified && <Timer />}
    />
  );
};

const CheckCodeButton = ({
  isSentCode,
  isNotMatchedCode,
  isVerified,
  onClick,
}: {
  isSentCode: boolean;
  isNotMatchedCode: boolean;
  isVerified: boolean;
  onClick: () => void;
}) => {
  const verificationCode = useSignUpByEmailFormStore(
    (state) => state.verificationCode,
  );
  const timeLeft = useSignUpByEmailFormStore((state) => state.timeLeft);

  return (
    <Button
      type="button"
      colorType="secondary"
      variant="filled"
      size="medium"
      fullWidth={false}
      className="w-[6.5rem] mb-6"
      onClick={onClick}
      disabled={
        verificationCode.length < VERIFICATION_CODE_LENGTH ||
        (timeLeft === 0 && isSentCode) ||
        isNotMatchedCode ||
        isVerified
      }
    >
      확인
    </Button>
  );
};

const Password = () => {
  const isPasswordEmpty = useSignUpByEmailFormStore(
    (state) => state.isPasswordEmpty,
  );
  const isValidPassword = useSignUpByEmailFormStore(
    (state) => state.isValidPassword,
  );
  const { setPassword } = useSignUpByEmailFormStore((state) => state.actions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: password } = e.target;

    setPassword(password);
  };

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
  const isConfirmPasswordEmpty = useSignUpByEmailFormStore(
    (state) => state.isConfirmPasswordEmpty,
  );
  const isValidPassword = useSignUpByEmailFormStore(
    (state) => state.isValidPassword,
  );
  const isValidConfirmPassword = useSignUpByEmailFormStore(
    (state) => state.isValidConfirmPassword,
  );
  const { setConfirmPassword } = useSignUpByEmailFormStore(
    (state) => state.actions,
  );

  let statusText = "";

  if (isValidPassword) {
    if (isValidConfirmPassword) statusText = "비밀번호가 일치합니다";
    else statusText = "비밀번호가 서로 일치하지 않습니다";
  } else {
    if (isValidConfirmPassword) statusText = "";
    else statusText = "비밀번호가 서로 일치하지 않습니다";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: passwordConfirm } = e.target;

    setConfirmPassword(passwordConfirm);
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
          onChange={handleChange}
          isError={!isConfirmPasswordEmpty && !isValidConfirmPassword}
        />
        <StatusText
          isError={!isConfirmPasswordEmpty && !isValidConfirmPassword}
        >
          {isConfirmPasswordEmpty ? "" : statusText}
        </StatusText>
      </div>
      <span className="body-3 px-3 pt-1 text-grey-500">
        영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로 입력해
        주세요.
      </span>
    </>
  );
};

export const SignUpByEmailForm = () => {
  const { resetState } = useSignUpByEmailFormStore((state) => state.actions);
  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();

  const handleOpenSnackbar = useSnackBar();

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
      handleOpenSnackbar("이메일과 비밀번호를 모두 입력해 주세요");
      return;
    }

    const isValidEmailAndPassword =
      isValidEmail && isValidPassword && isValidConfirmPassword;

    if (!isValidEmailAndPassword) {
      handleOpenSnackbar("이메일 또는 비밀번호를 올바르게 입력해 주세요");
      return;
    }

    const canSignUp = isValidEmail && isValidPassword && isValidConfirmPassword;

    if (canSignUp) postSignUpByEmail({ email, password });
  };

  useEffect(() => {
    resetState();
  }, [resetState]);

  return (
    <form className="flex flex-col gap-8 self-stretch" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <VerifyEmail />
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
