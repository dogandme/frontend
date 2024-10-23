import { useRef } from "react";
import { MyInfo } from "@/entities/auth/api";
import { formatDateToYearMonthDay, useSnackBar } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import {
  usePostCheckDuplicateNicknameState,
  usePutChangeNickname,
} from "../api";
import { validateNickname } from "../lib";
import { NicknameInput } from "./NicknameInput";

export const ChangeNicknameModal = ({
  onClose,
  nickLastModDt,
}: {
  onClose: () => Promise<void>;
  nickLastModDt: NonNullable<MyInfo["nickLastModDt"]>;
}) => {
  const nicknameRef = useRef<HTMLInputElement | null>(null);

  const handleOpenSnackbar = useSnackBar();

  const { mutate: putChangeNickname, isPending: isChangeNicknamePending } =
    usePutChangeNickname();
  const { isDuplicateNickname, isPending: isDuplicateCheckPending } =
    usePostCheckDuplicateNicknameState();

  const handleSubmit = () => {
    const { token } = useAuthStore.getState();

    if (!token) return;

    const nickname = nicknameRef.current?.value || "";

    const isNicknameEmpty = nickname.length === 0;

    if (isNicknameEmpty) {
      handleOpenSnackbar("닉네임을 입력해 주세요");
      return;
    }

    const isNicknameValid = validateNickname(nickname);

    if (!isNicknameValid) {
      handleOpenSnackbar("올바른 닉네임을 입력해 주세요");
      return;
    }

    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const canChange = new Date(nickLastModDt) < oneMonthAgo;

    if (!canChange) {
      handleOpenSnackbar("한달 이후 닉네임을 변경해 주세요");
      return;
    }

    if (isDuplicateNickname || isDuplicateCheckPending) {
      handleOpenSnackbar("이미 존재하는 닉네임 입니다");
      return;
    }

    putChangeNickname({ nickname });
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
          disabled={isChangeNicknamePending || isDuplicateCheckPending}
          onClick={handleSubmit}
        >
          저장
        </Modal.FilledButton>
      </Modal.Footer>
    </Modal>
  );
};
