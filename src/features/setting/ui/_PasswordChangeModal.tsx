import { PasswordInput } from "@/entities/auth/ui";
import { useModal } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { usePasswordChangeFormStore } from "../store";

// TODO 사용 가능한 비밀 번호 시 statusText 변경

const validatePassword = (password: string) => {
  // 조건
  // 1. 영문, 숫자, 특수문자 3가지 조합 포함
  // 2. 8~15자 이내
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  return passwordRegex.test(password);
};

const CurrentPasswordInput = () => {
  const isValidPassword = usePasswordChangeFormStore(
    (state) => state.isValidPassword,
  );
  const isEmptyCurrentPassword = usePasswordChangeFormStore(
    (state) => state.isEmptyCurrentPassword,
  );

  const setCurrentPassword = usePasswordChangeFormStore(
    (state) => state.setCurrentPassword,
  );
  const setIsValidPassword = usePasswordChangeFormStore(
    (state) => state.setIsValidPassword,
  );

  const setIsEmptyCurrentPassword = usePasswordChangeFormStore(
    (state) => state.setIsEmptyCurrentPassword,
  );

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setCurrentPassword(value);

    const isValidPassword = validatePassword(value);
    const isPasswordEmpty = value.length === 0;

    setIsValidPassword(isValidPassword);
    setIsEmptyCurrentPassword(isPasswordEmpty);
  };

  const statusText = isEmptyCurrentPassword
    ? "비밀번호를 입력해 주세요"
    : isValidPassword
      ? ""
      : "비밀번호 형식에 맞게 입력해 주세요";

  return (
    <PasswordInput
      id="current-password"
      label="현재 비밀번호"
      name="current-password"
      placeholder="현재 비밀번호를 입력해주세요"
      essential
      onChange={handleChange}
      statusText={statusText}
      isError={!isEmptyCurrentPassword && !isValidPassword}
    />
  );
};

const NewPasswordInput = () => {
  const isValidNewPassword = usePasswordChangeFormStore(
    (state) => state.isValidNewPassword,
  );
  const isEmptyNewPassword = usePasswordChangeFormStore(
    (state) => state.isEmptyNewPassword,
  );

  const setNewPassword = usePasswordChangeFormStore(
    (state) => state.setNewPassword,
  );
  const setIsValidNewPassword = usePasswordChangeFormStore(
    (state) => state.setIsValidNewPassword,
  );
  const setIsValidConfirmPassword = usePasswordChangeFormStore(
    (state) => state.setIsValidConfirmPassword,
  );

  const setIsEmptyNewPassword = usePasswordChangeFormStore(
    (state) => state.setIsEmptyNewPassword,
  );

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setNewPassword(value);

    const isValidNewPassword = validatePassword(value);
    const isNewPasswordEmpty = value.length === 0;
    setIsValidNewPassword(isValidNewPassword);
    setIsEmptyNewPassword(isNewPasswordEmpty);

    const { confirmPassword } = usePasswordChangeFormStore.getState();
    setIsValidConfirmPassword(value === confirmPassword);
  };

  const statusText = isEmptyNewPassword
    ? "비밀번호를 입력해 주세요"
    : isValidNewPassword
      ? ""
      : "비밀번호 형식에 맞게 입력해 주세요";

  return (
    <PasswordInput
      id="new-password"
      label="새 비밀번호"
      name="new-password"
      placeholder="비밀번호를 입력해 주세요"
      essential
      onChange={handleChange}
      statusText={statusText}
      isError={!isEmptyNewPassword && !isValidNewPassword}
    />
  );
};

const ConfirmNewPasswordInput = () => {
  const isValidConfirmPassword = usePasswordChangeFormStore(
    (state) => state.isValidConfirmPassword,
  );
  const isEmptyConfirmPassword = usePasswordChangeFormStore(
    (state) => state.isEmptyConfirmPassword,
  );

  const setConfirmPassword = usePasswordChangeFormStore(
    (state) => state.setConfirmPassword,
  );
  const setIsValidConfirmPassword = usePasswordChangeFormStore(
    (state) => state.setIsValidConfirmPassword,
  );

  const setIsEmptyConfirmPassword = usePasswordChangeFormStore(
    (state) => state.setIsEmptyConfirmPassword,
  );

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setConfirmPassword(value);

    const isConfirmPasswordEmpty = value.length === 0;
    setIsEmptyConfirmPassword(isConfirmPasswordEmpty);

    const { newPassword } = usePasswordChangeFormStore.getState();
    setIsValidConfirmPassword(newPassword === value);
  };

  const statusText = isEmptyConfirmPassword
    ? "비밀번호를 입력해 주세요"
    : isValidConfirmPassword
      ? ""
      : "비밀번호가 서로 일치하지 않습니다";

  return (
    <PasswordInput
      id="confirm-new-password"
      name="confirm-new-password"
      placeholder="비밀번호를 다시 한 번 입력해주세요"
      essential
      onChange={handleChange}
      statusText={statusText}
      isError={!isEmptyConfirmPassword && !isValidConfirmPassword}
    />
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

  // ExitModal 이 Confirm 되면 발생 할 이벤트 핸들러
  const handleExitPasswordChangeModal = () => {
    resetPasswordChangeForm();
    onClose();
  };

  const { handleOpen: handleOpenExitModal, onClose: onCloseExitModal } =
    useModal(() => (
      <ExitConfirmModal
        onClose={onCloseExitModal}
        onConfirm={handleExitPasswordChangeModal}
      />
    ));

  // PasswordChangeModal X 아이콘이나 취소 버튼이 클릭 시 호출 되는 이벤트 핸들러
  const handleClose = () => {
    const { currentPassword, newPassword, confirmPassword } =
      usePasswordChangeFormStore.getState();
    if (currentPassword || newPassword || confirmPassword) {
      handleOpenExitModal();
      return;
    }
    onClose();
  };

  return (
    <Modal modalType="center">
      <section className="flex justify-between self-stretch">
        <h1 className="title-1 text-grey-900">비밀번호 변경</h1>
        <button onClick={handleClose}>
          <CloseIcon />
        </button>
      </section>
      <form
        action=""
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <CurrentPasswordInput />
        <div className="flex flex-col gap-1">
          <NewPasswordInput />
          <ConfirmNewPasswordInput />
        </div>
        <p className="body-3 px-3 pt-1 text-grey-500">
          영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로 입력해
          주세요.
        </p>
      </form>
      <div className="flex flex-col gap-2">
        <Button colorType="primary" variant="filled" size="medium">
          다음
        </Button>
        <Button
          colorType="tertiary"
          variant="text"
          size="medium"
          onClick={handleClose}
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
