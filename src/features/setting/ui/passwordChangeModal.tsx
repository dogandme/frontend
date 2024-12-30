import { useEffect, useState } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackbar } from "@/shared/store";
import { InputWrapper, StatusText } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { usePutChangePassword } from "../api";
import { usePasswordChangeFormStore } from "../store";

// TODO 사용 가능한 비밀 번호 시 statusText 변경

const CurrentPasswordInput = () => {
  const isValidPassword = usePasswordChangeFormStore(
    (state) => state.isValidPassword,
  );
  const isFilledCurrentPassword = usePasswordChangeFormStore(
    (state) => state.isFilledCurrentPassword,
  );

  const setCurrentPassword = usePasswordChangeFormStore(
    (state) => state.setCurrentPassword,
  );

  const statusText = !isFilledCurrentPassword
    ? "비밀번호를 입력해 주세요"
    : isValidPassword
      ? ""
      : "비밀번호 형식에 맞게 입력해 주세요";

  const isError = isFilledCurrentPassword && !isValidPassword;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <InputWrapper>
      <PasswordInput
        id="current-password"
        label="현재 비밀번호"
        name="current-password"
        placeholder="현재 비밀번호를 입력해주세요"
        essential
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={({ target }) => setCurrentPassword(target.value)}
        isError={isError}
      />
      <StatusText isError={isError}>
        {isError || isFocused ? statusText : ""}
      </StatusText>
    </InputWrapper>
  );
};

const NewPasswordInput = () => {
  const isValidNewPassword = usePasswordChangeFormStore(
    (state) => state.isValidNewPassword,
  );
  const isFilledNewPassword = usePasswordChangeFormStore(
    (state) => state.isFilledNewPassword,
  );

  const setNewPassword = usePasswordChangeFormStore(
    (state) => state.setNewPassword,
  );

  const statusText = !isFilledNewPassword
    ? "비밀번호를 입력해 주세요"
    : isValidNewPassword
      ? "사용가능한 비밀번호 입니다"
      : "비밀번호 형식에 맞게 입력해 주세요";

  const isError = isFilledNewPassword && !isValidNewPassword;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <InputWrapper>
      <PasswordInput
        id="new-password"
        label="새 비밀번호"
        name="new-password"
        placeholder="비밀번호를 입력해 주세요"
        essential
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={({ target }) => setNewPassword(target.value)}
        isError={isError}
      />
      <StatusText isError={isError}>
        {isError || isFocused ? statusText : ""}
      </StatusText>
    </InputWrapper>
  );
};

const ConfirmNewPasswordInput = () => {
  const isFilledConfirmPassword = usePasswordChangeFormStore(
    (state) => state.isFilledConfirmPassword,
  );

  const isSameNewPasswordAndConfirmPassword = usePasswordChangeFormStore(
    (state) => state.isSameNewPasswordAndConfirmPassword,
  );

  const setConfirmPassword = usePasswordChangeFormStore(
    (state) => state.setConfirmPassword,
  );

  const statusText = !isFilledConfirmPassword
    ? "비밀번호를 입력해 주세요"
    : isSameNewPasswordAndConfirmPassword
      ? "비밀번호가 일치합니다"
      : "비밀번호가 서로 일치하지 않습니다";

  const isError =
    isFilledConfirmPassword && !isSameNewPasswordAndConfirmPassword;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <InputWrapper>
      <PasswordInput
        id="confirm-new-password"
        name="confirm-new-password"
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        essential
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={({ target }) => setConfirmPassword(target.value)}
        isError={isError}
      />
      <StatusText isError={isError}>
        {isError || isFocused ? statusText : ""}
      </StatusText>
    </InputWrapper>
  );
};

export const PasswordChangeModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );

  const { mutate: putChangePassword, isPending } = usePutChangePassword();
  const handleOpenSnackbar = useSnackbar("default");

  const handleSave = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      isAllValueFilled,
      isAllValueValid,
      isSameNewPasswordAndConfirmPassword,
    } = usePasswordChangeFormStore.getState();

    if (!isAllValueFilled) {
      handleOpenSnackbar("항목을 모두 입력해 주세요");
      return;
    }

    if (!isSameNewPasswordAndConfirmPassword) {
      handleOpenSnackbar("새 비밀번호를 다시 확인해 주세요");
      return;
    }

    if (!isAllValueValid) {
      handleOpenSnackbar("비밀번호 형식에 맞게 입력해 주세요");
      return;
    }

    putChangePassword({
      password: currentPassword,
      newPw: newPassword,
      newPwChk: confirmPassword,
    });
  };

  useEffect(() => {
    return () => resetPasswordChangeForm();
  }, [resetPasswordChangeForm]);

  return (
    <Modal modalType="center">
      <Modal.Header
        onClick={onClose}
        closeButtonAriaLabel="비밀번호 변경 모달 닫기"
      >
        비밀번호 변경
      </Modal.Header>
      <Modal.Content>
        <CurrentPasswordInput />
        <div className="flex flex-col gap-1">
          <NewPasswordInput />
          <ConfirmNewPasswordInput />
          <p className="body-3 px-3 pt-1 text-grey-500">
            영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로
            입력해 주세요.
          </p>
        </div>
        <Modal.Footer axis="col">
          <Modal.FilledButton onClick={handleSave} disabled={isPending}>
            저장
          </Modal.FilledButton>
          <Modal.TextButton onClick={onClose} disabled={isPending}>
            취소
          </Modal.TextButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
