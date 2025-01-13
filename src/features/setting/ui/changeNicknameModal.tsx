import { useRef } from "react";
import {
  usePostCheckDuplicateNicknameState,
  validateNickname,
  NicknameInput,
} from "@/features/auth/@x/setting";
import type { MyInfo } from "@/entities/auth/types/server";
import { formatDateToYearMonthDay } from "@/shared/lib";
import { useAuthStore, useSnackbar } from "@/shared/store";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { usePutChangeNickname } from "../api";

interface ChangeNicknameModalProps
  extends NonNullableObject<Pick<MyInfo, "nickLastModDt">> {
  onClose: () => Promise<void>;
}

export const ChangeNicknameModal = ({
  onClose,
  nickLastModDt,
}: ChangeNicknameModalProps) => {
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const handleOpenSnackbar = useSnackbar("default");

  const { mutate: putChangeNickname, isPending: isChangeNicknamePending } =
    usePutChangeNickname();
  const { isPending: isDuplicateCheckPending } =
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
