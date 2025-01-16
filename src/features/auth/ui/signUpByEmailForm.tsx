import {
  ButtonHTMLAttributes,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import {
  Controller,
  type FieldError,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PasswordInput as _PasswordInput } from "@/entities/auth/ui";
import { ROUTER_PATH } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { useSnackbar } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { Input, InputProps, InputWrapper, StatusText } from "@/shared/ui/input";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";
import {
  usePostCheckCode,
  usePostSendCode,
  usePostSignUpByEmail,
} from "../api";
import { VERIFICATION_CODE_LENGTH } from "../constants";
import { ExitConfirmationModal } from "./exitConfirmationModal";

const Timer = ({
  time,
  onChange,
}: {
  time: number;
  onChange: (time: number) => void;
}) => {
  const INTERVAL = 1000;

  const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
    2,
    "0",
  );
  const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      onChange(time - INTERVAL);
    }, INTERVAL);

    if (time === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  return (
    <span
      className={`body-2 ${time === 0 ? "text-pink-500" : "text-grey-700"}`}
    >
      {minutes}:{seconds}
    </span>
  );
};

// todo 이메일 인증 코드 보낸 이후 이메일을 수정할 경우, timeLeft & codeInput && mutation 초기화
const EmailInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = "올바른 이메일 형식입니다.";

  return (
    <InputWrapper>
      <Input
        ref={ref}
        id="email"
        type="email"
        inputMode="email"
        placeholder="이메일을 입력해주세요"
        componentType="outlinedText"
        label="이메일"
        isError={!!error}
        essential
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

const CodeInput = forwardRef<
  HTMLInputElement,
  {
    isVerified: boolean;
    error?: FieldError;
    trailingNode: InputProps["trailingNode"];
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isVerified, trailingNode, disabled, ...rest }, ref) => {
  let statusText = "";

  if (isVerified) statusText = "인증되었습니다.";
  if (error && error.message) statusText = error.message;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        id="verification-code"
        type="text"
        componentType="outlinedText"
        placeholder="인증코드 7자리를 입력해 주세요"
        maxLength={VERIFICATION_CODE_LENGTH}
        isError={!!error}
        disabled={disabled}
        trailingNode={trailingNode}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

const CodeButton = ({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      type="button"
      colorType="secondary"
      variant="filled"
      size="medium"
      fullWidth={false}
      className="w-[6.5rem] mb-6"
      {...rest}
    >
      {children}
    </Button>
  );
};

const PasswordInput = forwardRef<
  HTMLInputElement,
  { error?: FieldError } & InputHTMLAttributes<HTMLInputElement>
>(({ error, ...rest }, ref) => {
  return (
    <InputWrapper>
      <_PasswordInput
        ref={ref}
        id="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해 주세요"
        essential
        isError={!!error}
        {...rest}
      />
      <StatusText isError={!!error}>{error?.message || ""}</StatusText>
    </InputWrapper>
  );
});

const ConfirmPasswordInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid?: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = "비밀번호가 일치합니다.";

  return (
    <InputWrapper>
      <_PasswordInput
        ref={ref}
        id="confirm-password"
        placeholder="비밀번호를 다시 한번 입력해 주세요"
        essential
        isError={!!error}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});

interface SignUpByEmailFormType {
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

export const SignUpByEmailForm = () => {
  const handleOpenSnackbar = useSnackbar("default");

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { formState, handleSubmit, register, getValues, control, setError } =
    useForm<SignUpByEmailFormType>({
      mode: "onChange",
      defaultValues: {
        email: "",
        verificationCode: "",
        password: "",
        confirmPassword: "",
      },
    });

  const { errors, dirtyFields, isDirty } = formState;

  const { mutate: postSendCode, isSuccess: isCodeSent } = usePostSendCode();
  const { mutate: postCheckCode, isSuccess: isCodeChecked } =
    usePostCheckCode();
  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();

  const sendCode = () => {
    postSendCode(
      { email: getValues("email") },
      {
        onSuccess: () => {
          setTimeLeft(1000 * 60 * 3);
        },
        onError: (error) => {
          const isEmailDuplicated = error.code === 409;

          if (isEmailDuplicated)
            setError("email", {
              type: "validate",
              message: "이미 가입된 이메일입니다.",
            });
        },
      },
    );
  };

  const checkCode = () => {
    const { email, verificationCode } = getValues();

    postCheckCode(
      { email, authNum: verificationCode },
      {
        onError: (error) => {
          if (error.code === 400) {
            setError("verificationCode", {
              type: "validate",
              message: "인증코드를 다시 확인해 주세요.",
            });
          }
        },
      },
    );
  };

  const onError: SubmitErrorHandler<SignUpByEmailFormType> = (errors) => {
    if (
      errors.email?.type === "required" ||
      errors.password?.type === "required" ||
      errors.confirmPassword?.type === "required"
    ) {
      handleOpenSnackbar("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    handleOpenSnackbar("이메일 또는 비밀번호를 올바르게 입력해 주세요.");
  };

  const onSubmit: SubmitHandler<SignUpByEmailFormType> = ({
    email,
    password,
  }: SignUpByEmailFormType) => {
    postSignUpByEmail({ email, password });
  };

  const navigate = useNavigate();

  const { handleOpen, onClose } = useModal(() => {
    return <ExitConfirmationModal onClose={onClose} />;
  });

  const handleGoToPreviousPage = () => {
    if (!isDirty) {
      navigate(ROUTER_PATH.LOGIN);
      return;
    }

    handleOpen();
  };

  return (
    <>
      <BackwardNavigationBar onClick={handleGoToPreviousPage} />

      <main className="flex flex-col gap-8 self-stretch px-4 pt-8">
        <h1 className="headline-3 mx-auto">이메일로 회원가입</h1>
        <form
          className="flex flex-col gap-8 self-stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div>
            <div className="flex items-end justify-between gap-2">
              <EmailInput
                disabled={isCodeChecked}
                error={errors.email}
                isValid={!!dirtyFields.email && !errors.email}
                {...register("email", {
                  required: "이메일 형식으로 입력해 주세요.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "이메일 형식으로 입력해 주세요.",
                  },
                })}
              />

              <CodeButton
                onClick={sendCode}
                disabled={
                  getValues("email").length === 0 ||
                  !!errors.email ||
                  isCodeChecked ||
                  (timeLeft > 1000 * 60 && isCodeSent && !isCodeChecked)
                }
              >
                코드전송
              </CodeButton>
            </div>

            <div className="flex items-end justify-between gap-2">
              <Controller
                name="verificationCode"
                control={control}
                defaultValue=""
                rules={{
                  required: `인증코드 ${VERIFICATION_CODE_LENGTH}자리를 입력해 주세요.`,
                  minLength: {
                    value: VERIFICATION_CODE_LENGTH,
                    message: `인증코드 ${VERIFICATION_CODE_LENGTH}자리를 입력해 주세요.`,
                  },
                  validate: {
                    isTimeOver: () =>
                      timeLeft > 0 ||
                      "인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요.",
                  },
                }}
                render={({ field }) => (
                  <CodeInput
                    error={errors.verificationCode}
                    isVerified={isCodeChecked}
                    disabled={!isCodeSent || isCodeChecked}
                    trailingNode={
                      !isCodeChecked &&
                      isCodeSent && (
                        <Timer
                          time={timeLeft}
                          onChange={(time) => setTimeLeft(time)}
                        />
                      )
                    }
                    {...field}
                    onChange={(e) => {
                      // 숫자만 입력했을 때 state 업데이트
                      if (/^\d*$/.test(e.target.value)) {
                        field.onChange(e);
                      }
                    }}
                  />
                )}
              />

              <CodeButton
                onClick={checkCode}
                disabled={
                  getValues("verificationCode").length === 0 ||
                  !!errors.verificationCode ||
                  isCodeChecked ||
                  (timeLeft < 1000 && isCodeSent)
                }
              >
                확인
              </CodeButton>
            </div>
          </div>

          <div>
            <PasswordInput
              error={errors.password}
              {...register("password", {
                required: "비밀번호를 입력해 주세요.",
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,15}$/,
                  message: "비밀번호 형식에 맞게 입력해 주세요.",
                },
              })}
            />
            <ConfirmPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: "비밀번호를 다시 한번 입력해 주세요.",
                pattern: {
                  value:
                    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,15}$/,
                  message: "비밀번호 형식에 맞게 입력해 주세요.",
                },
                validate: {
                  isNotMatchedWithPassword: (value, formValues) =>
                    value === formValues.password ||
                    "비밀번호가 서로 일치하지 않습니다.",
                },
              })}
            />
            <span className="body-3 px-3 pt-1 text-grey-500">
              영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로
              입력해 주세요.
            </span>
          </div>

          <Button
            type="submit"
            colorType="primary"
            variant="filled"
            size="large"
          >
            다음
          </Button>
        </form>
      </main>
    </>
  );
};
