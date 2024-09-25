import { ConfirmModal, type ConfirmModalProps } from "./ConfirmModal";

export const ExitConfirmModal = (
  props: Omit<ConfirmModalProps, "title" | "children">,
) => (
  <ConfirmModal {...props} title="화면을 나가시겠습니까?">
    <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
    <p>정말 화면을 나가시겠습니까?</p>
  </ConfirmModal>
);
