import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { PasswordCheckModal } from "./passwordCheckModal";

export const AccountCancellationModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const queryClient = useQueryClient();

  const { handleOpen, onClose: onClosePasswordCheckModal } = useModal(
    () => <PasswordCheckModal onClose={onClosePasswordCheckModal} />,
    {
      beforeClose: () => {
        const mutation = queryClient.getMutationCache().find({
          mutationKey: ["deleteAccount"],
        });
        if (mutation?.state.status === "pending") {
          return true;
        }
      },
    },
  );

  return (
    <Modal modalType="fullPage">
      <Modal.Header
        onClick={onClose}
        closeButtonAriaLabel="회원 탈퇴 모달 닫기"
      />
      <Modal.Content>
        {/* 프로덕트 마스코트 */}
        <img src="/default-image.png" className="mx-auto" />
        {/* 탈퇴 안내 문구 */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-grey-900 title-1">
            서비스 탈퇴 전 확인해 주세요
          </h1>
          <p className="flex flex-col text-center text-grey-700 body-2">
            <span>탈퇴하시면 즉시 탈퇴 처리 되며</span>
            <span>서비스 이용은 불가합니다.</span>
            <span>또한 모든 데이터는 복구가 불가능 합니다.</span>
          </p>
        </div>
      </Modal.Content>
      {/* 버튼 */}
      <Modal.Footer axis="col">
        <Modal.FilledButton onClick={handleOpen} size="large" className="btn-2">
          다음
        </Modal.FilledButton>
        <Modal.TextButton
          onClick={onClose}
          size="large"
          className="btn-2"
          colorType="tertiary"
        >
          취소
        </Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};
