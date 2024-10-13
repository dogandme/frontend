import { useState } from "react";
import { MutationState, useMutationState } from "@tanstack/react-query";
import { MyInfo } from "@/entities/auth/api";
import { formatDateToYearMonthDay, useSnackBar } from "@/shared/lib";
import { InfoIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { Notice } from "@/shared/ui/notice";
import { Snackbar } from "@/shared/ui/snackbar";
import {
  DuplicateNicknameRequestData,
  DuplicateNicknameResponse,
} from "../api";
import { validateNickname } from "../lib";
import { NicknameInput } from "./NicknameInput";

export const ChangeNicknameModal = ({
  onClose,
  nickLastModDt,
}: {
  onClose: () => void;
  nickLastModDt: NonNullable<MyInfo["nickLastModDt"]>;
}) => {
  const [nickname, setNickname] = useState<string>("");

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

  const duplicateNicknameResponseCacheArr = useMutationState<
    MutationState<
      DuplicateNicknameResponse,
      Error,
      DuplicateNicknameRequestData
    >
  >({
    filters: {
      mutationKey: ["checkDuplicateNickname"],
    },
  });

  const handleSubmit = () => {
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

    const lastDuplicateNicknameResponse =
      duplicateNicknameResponseCacheArr[
        duplicateNicknameResponseCacheArr.length - 1
      ];
    const isDuplicateNickname =
      lastDuplicateNicknameResponse.status === "error" &&
      lastDuplicateNicknameResponse.variables?.nickname === nickname;

    if (isDuplicateNickname) {
      openDuplicateNicknameAlert();
      return;
    }

    onClose();
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

        <NicknameInput onChange={setNickname} />
      </Modal.Content>

      <Modal.Footer axis="col">
        <Modal.FilledButton type="button" onClick={handleSubmit}>
          저장
        </Modal.FilledButton>
      </Modal.Footer>
    </Modal>
  );
};
