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
import {
  signUpFormErrorMessage,
  signUpFormValidationMessage,
  VERIFICATION_CODE_LENGTH,
  emailRegex,
  passwordRegex,
} from "../constants";
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
  if (isValid) statusText = signUpFormValidationMessage.email;

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
    timeLeft: number;
    trailingNode: InputProps["trailingNode"];
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isVerified, timeLeft, trailingNode, disabled, ...rest }, ref) => {
  let statusText = "";

  if (isVerified) statusText = signUpFormValidationMessage.verificationCode;
  if (error && error.message) statusText = error.message;
  if (timeLeft === 0)
    statusText = signUpFormErrorMessage.verificationCode.isTimeOver;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        id="verification-code"
        type="text"
        componentType="outlinedText"
        placeholder="인증코드 7자리를 입력해 주세요"
        maxLength={VERIFICATION_CODE_LENGTH}
        isError={timeLeft === 0 || !!error}
        disabled={disabled}
        trailingNode={trailingNode}
        {...rest}
      />
      <StatusText isError={timeLeft === 0 || !!error}>{statusText}</StatusText>
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
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = signUpFormValidationMessage.password;

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
      <StatusText isError={!!error}>{statusText}</StatusText>
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
  if (isValid) statusText = signUpFormValidationMessage.confirmPassword;

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

  const [timeLeft, setTimeLeft] = useState<number>(NaN);

  const {
    formState,
    handleSubmit,
    register,
    getValues,
    control,
    resetField,
    setError,
    watch,
  } = useForm<SignUpByEmailFormType>({
    mode: "onChange",
    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { errors, dirtyFields, isDirty } = formState;

  const {
    mutate: postSendCode,
    isSuccess: isCodeSent,
    variables,
    reset: resetSendCode,
  } = usePostSendCode();
  const {
    mutate: postCheckCode,
    isSuccess: isCodeChecked,
    reset: resetCheckCode,
  } = usePostCheckCode();
  const { mutate: postSignUpByEmail } = usePostSignUpByEmail();

  const watchedEmail = watch("email");

  // 이메일이 변경되었을 때, 시간 초기화 & 인증코드 input 초기화 & mutation 초기화
  useEffect(() => {
    const isSameEmail = variables?.email === watchedEmail;

    if (isSameEmail) return;

    setTimeLeft(NaN);
    resetField("verificationCode");
    resetSendCode();
    resetCheckCode();
  }, [watchedEmail, variables]);

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
              message: signUpFormErrorMessage.email.validate,
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
              type: "isNotMatched",
              message: signUpFormErrorMessage.verificationCode.isNotMatched,
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
      handleOpenSnackbar(signUpFormErrorMessage.submit.required);
      return;
    }

    handleOpenSnackbar(signUpFormErrorMessage.submit.invalid);
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

  console.log(getValues("email"));

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
                  required: signUpFormErrorMessage.email.required,
                  pattern: {
                    value: emailRegex,
                    message: signUpFormErrorMessage.email.pattern,
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
                  required: signUpFormErrorMessage.verificationCode.required,
                  minLength: {
                    value: VERIFICATION_CODE_LENGTH,
                    message: signUpFormErrorMessage.verificationCode.minLength,
                  },
                }}
                render={({ field }) => (
                  <CodeInput
                    error={errors.verificationCode}
                    isVerified={isCodeChecked}
                    disabled={!isCodeSent || isCodeChecked}
                    timeLeft={timeLeft}
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
              isValid={!!dirtyFields.password && !errors.password}
              {...register("password", {
                required: signUpFormErrorMessage.password.required,
                pattern: {
                  value: passwordRegex,
                  message: signUpFormErrorMessage.password.pattern,
                },
              })}
            />
            <ConfirmPasswordInput
              isValid={!!dirtyFields.confirmPassword && !errors.confirmPassword}
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: signUpFormErrorMessage.confirmPassword.required,
                pattern: {
                  value: passwordRegex,
                  message: signUpFormErrorMessage.confirmPassword.pattern,
                },
                validate: {
                  isNotMatchedWithPassword: (value, formValues) =>
                    value === formValues.password ||
                    signUpFormErrorMessage.confirmPassword
                      .isNotMatchedWithPassword,
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
