import { useEffect } from "react";
import { PasswordInput } from "@/entities/auth/ui";
import { useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { Modal } from "@/shared/ui/modal";
import { Snackbar } from "@/shared/ui/snackbar";
import { usePutSetPassword } from "../api/putSetPassword";
import { usePasswordSetFormStore } from "../store";

// TODO 사용 가능한 비밀 번호 시 statusText 변경

const NewPasswordInput = () => {
  const isValidNewPassword = usePasswordSetFormStore(
    (state) => state.isValidNewPassword,
  );
  const isFilledNewPassword = usePasswordSetFormStore(
    (state) => state.isFilledNewPassword,
  );

  const setNewPassword = usePasswordSetFormStore(
    (state) => state.setNewPassword,
  );

  const statusText = !isFilledNewPassword
    ? "비밀번호를 입력해 주세요"
    : isValidNewPassword
      ? "사용가능한 비밀번호 입니다"
      : "비밀번호 형식에 맞게 입력해 주세요";

  return (
    <PasswordInput
      id="new-password"
      label="새 비밀번호"
      name="new-password"
      placeholder="비밀번호를 입력해 주세요"
      essential
      onChange={({ target }) => setNewPassword(target.value)}
      statusText={statusText}
      isError={isFilledNewPassword && !isValidNewPassword}
    />
  );
};

const ConfirmNewPasswordInput = () => {
  const isFilledConfirmPassword = usePasswordSetFormStore(
    (state) => state.isFilledConfirmPassword,
  );

  const isSameNewPasswordAndConfirmPassword = usePasswordSetFormStore(
    (state) => state.isSameNewPasswordAndConfirmPassword,
  );

  const setConfirmPassword = usePasswordSetFormStore(
    (state) => state.setConfirmPassword,
  );

  const statusText = !isFilledConfirmPassword
    ? "비밀번호를 입력해 주세요"
    : isSameNewPasswordAndConfirmPassword
      ? "비밀번호가 일치 합니다"
      : "비밀번호가 서로 일치하지 않습니다";

  return (
    <PasswordInput
      id="confirm-new-password"
      name="confirm-new-password"
      placeholder="비밀번호를 다시 한 번 입력해주세요"
      essential
      onChange={({ target }) => setConfirmPassword(target.value)}
      statusText={statusText}
      isError={isFilledConfirmPassword && !isSameNewPasswordAndConfirmPassword}
    />
  );
};

export const PasswordSetModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const resetPasswordSetForm = usePasswordSetFormStore((state) => state.reset);

  const { mutate: putSetPassword } = usePutSetPassword({
    onSuccessCallback: () => {
      resetPasswordSetForm();
      onClose();
      handleOpenSnackbar();
    },
  });
  const { handleOpen: handleOpenSnackbar, onClose: onCloseSnackbar } =
    useSnackBar(() => (
      <Snackbar onClose={onCloseSnackbar}>비밀번호가 설정 되었습니다.</Snackbar>
    ));

  const handleSave = () => {
    const {
      newPassword,
      confirmPassword,
      isAllValueFilled,
      isAllValueValid,
      isSameNewPasswordAndConfirmPassword,
    } = usePasswordSetFormStore.getState();
    const { token } = useAuthStore.getState();

    if (!isAllValueFilled) {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error("항목을 모두 입력해 주세요");
      return;
    }

    if (!isSameNewPasswordAndConfirmPassword) {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error("새 비밀번호를 다시 확인해 주세요");
      return;
    }

    if (!isAllValueValid) {
      // TODO 에러바운더리 로직 나오면 변경 하기
      console.error("비밀번호 형식에 맞게 입력해 주세요");
      return;
    }

    putSetPassword({
      newPw: newPassword,
      newPwChk: confirmPassword,
      token: token!,
    });
  };

  useEffect(() => {
    return () => resetPasswordSetForm();
  }, [resetPasswordSetForm]);

  return (
    <Modal modalType="center">
      <Modal.Header
        onClick={onClose}
        closeButtonAriaLabel="비밀번호 설정 모달 닫기"
      >
        비밀번호 설정
      </Modal.Header>
      <Modal.Content>
        <div className="flex flex-col gap-1">
          <NewPasswordInput />
          <ConfirmNewPasswordInput />
          <p className="body-3 px-3 pt-1 text-grey-500">
            영문, 숫자, 특수문자 3가지 조합을 포함하는 8자 이상 15자 이내로
            입력해 주세요.
          </p>
        </div>
        <Modal.Footer axis="col">
          <Modal.FilledButton onClick={handleSave}>저장</Modal.FilledButton>
          <Modal.TextButton onClick={onClose}>취소</Modal.TextButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
