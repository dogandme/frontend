import { useRef } from "react";
import { MyInfo } from "@/entities/auth/api";
import { formatDateToYearMonthDay, useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { Snackbar } from "@/shared/ui/snackbar";
import { usePostDuplicateNicknameState, usePutChangeNickname } from "../api";
import { validateNickname } from "../lib";
import { NicknameInput } from "./NicknameInput";

export const ChangeNicknameModal = ({
  onClose,
  nickLastModDt,
}: {
  onClose: () => void;
  nickLastModDt: NonNullable<MyInfo["nickLastModDt"]>;
}) => {
  const nicknameRef = useRef<HTMLInputElement | null>(null);

  const { handleOpen: openRequiredAlert, onClose: closeRequiredAlert } =
    useSnackBar(() => (
      <Snackbar onClose={closeRequiredAlert}>닉네임을 입력해 주세요</Snackbar>
    ));
  const { handleOpen: openNicknameAlert, onClose: closeNicknameAlert } =
    useSnackBar(() => (
      <Snackbar onClose={closeNicknameAlert}>
        올바른 닉네임을 입력해 주세요
      </Snackbar>
    ));
  const { handleOpen: openChangePeriodAlert, onClose: closeChangePeriodAlert } =
    useSnackBar(() => (
      <Snackbar onClose={closeChangePeriodAlert}>
        한달 이후 닉네임을 변경해 주세요
      </Snackbar>
    ));
  const {
    handleOpen: openDuplicateNicknameAlert,
    onClose: closeDuplicateNicknameAlert,
  } = useSnackBar(() => (
    <Snackbar onClose={closeDuplicateNicknameAlert}>
      이미 존재하는 닉네임 입니다
    </Snackbar>
  ));

  const { mutate: postChangeNickname, status: changeNicknameStatus } =
    usePutChangeNickname({
      onSuccessCallback: onClose,
    });
  const { isDuplicateNickname, isPending: isDuplicateCheckPending } =
    usePostDuplicateNicknameState();

  const handleSubmit = () => {
    const { token } = useAuthStore.getState();

    if (!token) return;

    const nickname = nicknameRef.current?.value || "";

    const isNicknameEmpty = nickname.length === 0;

    if (isNicknameEmpty) {
      openRequiredAlert();
      return;
    }

    const isNicknameValid = validateNickname(nickname);

    if (!isNicknameValid) {
      openNicknameAlert();
      return;
    }

    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const canChange = new Date(nickLastModDt) <= oneMonthAgo;

    if (!canChange) {
      openChangePeriodAlert();
      return;
    }

    if (isDuplicateNickname || isDuplicateCheckPending) {
      openDuplicateNicknameAlert();
      return;
    }

    postChangeNickname({ token, nickname });
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

        <NicknameInput ref={nicknameRef} />
      </Modal.Content>

      <Modal.Footer axis="col">
        <Modal.FilledButton
          type="button"
          disabled={
            changeNicknameStatus === "pending" || isDuplicateCheckPending
          }
          onClick={handleSubmit}
        >
          저장
        </Modal.FilledButton>
      </Modal.Footer>
    </Modal>
  );
};
