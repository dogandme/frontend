import { forwardRef, InputHTMLAttributes } from "react";
import {
  Controller,
  type FieldError,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import {
  NICKNAME_MAX_LENGTH,
  nicknameRegex,
  usePostCheckDuplicateNickname,
} from "@/features/auth/@x/setting";
import type { MyInfo } from "@/entities/auth/types/server";
import { formatDateToYearMonthDay } from "@/shared/lib";
import { useSnackbar } from "@/shared/store";
import { InfoIcon } from "@/shared/ui/icon";
import { Input, InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { usePutChangeNickname } from "../api";
import {
  changeNicknameFormErrorMessage,
  changeNicknameFormValidationMessage,
} from "../constants";

interface ChangeNicknameFormType {
  nickname: string;
}

interface ChangeNicknameModalProps
  extends NonNullableObject<Pick<MyInfo, "nickLastModDt">> {
  onClose: () => Promise<void>;
}

export const ChangeNicknameModal = ({
  onClose,
  nickLastModDt,
}: ChangeNicknameModalProps) => {
  const { formState, handleSubmit, setError, control, setValue } =
    useForm<ChangeNicknameFormType>({
      mode: "onChange",
      defaultValues: {
        nickname: "",
      },
    });
  const { errors, dirtyFields } = formState;

  const handleOpenSnackbar = useSnackbar("default");

  const {
    mutate: postCheckDuplicateNickname,
    status: postCheckDuplicateNicknameStatus,
  } = usePostCheckDuplicateNickname();
  const { mutate: putChangeNickname, status: putChangeNicknameStatus } =
    usePutChangeNickname();

  const onError: SubmitErrorHandler<ChangeNicknameFormType> = (errors) => {
    if (errors.nickname?.type === "required") {
      handleOpenSnackbar(changeNicknameFormErrorMessage.submit.required);
      return;
    }

    handleOpenSnackbar(changeNicknameFormErrorMessage.submit.invalid);
  };

  const onSubmit = ({ nickname }: ChangeNicknameFormType) => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const canChange = new Date(nickLastModDt) < oneMonthAgo;

    if (!canChange) {
      handleOpenSnackbar(changeNicknameFormErrorMessage.submit.canChange);
      return;
    }

    putChangeNickname(
      { nickname },
      {
        onError: (error) => {
          if (error.code === 409)
            setError("nickname", {
              type: "validate",
              message: changeNicknameFormErrorMessage.nickname.validate,
            });
        },
        onSuccess: onClose,
      },
    );
  };

  return (
    <Modal modalType="center">
      <Modal.Header onClick={onClose}>닉네임 변경</Modal.Header>
      <Modal.Content>
        <Notice>
          <InfoIcon />
          <div>
            <p>닉네임은 한달기준 1회 변경할 수 있습니다</p>
            <p>마지막 변경일 : {formatDateToYearMonthDay(nickLastModDt)}</p>
          </div>
        </Notice>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Controller
            name="nickname"
            control={control}
            rules={{
              required: changeNicknameFormErrorMessage.nickname.required,
              pattern: {
                value: nicknameRegex,
                message: changeNicknameFormErrorMessage.nickname.pattern,
              },
              maxLength: {
                value: NICKNAME_MAX_LENGTH,
                message: changeNicknameFormErrorMessage.nickname.maxLength,
              },
              onBlur: (e) => {
                postCheckDuplicateNickname(
                  { nickname: e.target.value },
                  {
                    onError: (error) => {
                      if (error.code === 409) {
                        setError("nickname", {
                          type: "validate",
                          message:
                            changeNicknameFormErrorMessage.nickname.validate,
                        });
                      }
                    },
                    onSuccess: onClose,
                  },
                );
              },
              onChange: (e) => {
                // 한글을 입력하면 NICKNAME_MAX_LENGTH를 넘어가는 경우가 있어서 추가
                if (e.target.value.length > NICKNAME_MAX_LENGTH) {
                  setValue(
                    "nickname",
                    e.target.value.slice(0, NICKNAME_MAX_LENGTH),
                  );
                }
              },
            }}
            render={({ field }) => (
              <NicknameInput
                error={errors.nickname}
                isValid={!!dirtyFields.nickname && !errors.nickname}
                {...field}
              />
            )}
          />

          <Modal.FilledButton
            type="submit"
            disabled={
              postCheckDuplicateNicknameStatus !== "success" ||
              putChangeNicknameStatus === "pending"
            }
            className="mt-8"
          >
            저장
          </Modal.FilledButton>
        </form>
      </Modal.Content>
    </Modal>
  );
};

const NicknameInput = forwardRef<
  HTMLInputElement,
  {
    error?: FieldError;
    isValid: boolean;
  } & InputHTMLAttributes<HTMLInputElement>
>(({ error, isValid, value, ...rest }, ref) => {
  let statusText = "";

  if (error && error.message) statusText = error.message;
  if (isValid) statusText = changeNicknameFormValidationMessage.nickname;

  return (
    <InputWrapper>
      <Input
        ref={ref}
        type="text"
        id="nickname"
        label="닉네임"
        placeholder="닉네임을 입력해 주세요"
        essential
        componentType="outlinedText"
        isError={!!error}
        maxLength={NICKNAME_MAX_LENGTH}
        trailingNode={
          <div className="flex gap-[.125rem] body-3">
            <span className="text-grey-500">{(value as string).length}</span>
            <span className="text-grey-300">/</span>
            <span className="text-grey-500">{NICKNAME_MAX_LENGTH}</span>
          </div>
        }
        value={value}
        {...rest}
      />
      <StatusText isError={!!error}>{statusText}</StatusText>
    </InputWrapper>
  );
});
