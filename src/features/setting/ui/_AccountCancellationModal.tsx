import { useModal } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { CloseNavigationBar } from "@/shared/ui/navigationbar";
import { CancellationCheckModal } from "./_CancellactionCheckModal";

export const AccountCancellationModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  const { handleOpen, onClose: onCloseCancellationCheckModal } = useModal(
    () => <CancellationCheckModal onClose={onCloseCancellationCheckModal} />,
  );

  return (
    // TODO FormModal 생성 되면 적용하기
    <Modal modalType="fullPage">
      <CloseNavigationBar onClick={onClose} aria-label="회원 탈퇴 모달 닫기" />
      <section className="flex flex-col gap-8 px-4">
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
        {/* 버튼 */}
        <div className="flex flex-col gap-4">
          <Button
            colorType="primary"
            variant="filled"
            size="large"
            className="btn-2"
            onClick={handleOpen}
          >
            다음
          </Button>
          <Button
            colorType="tertiary"
            variant="text"
            size="large"
            className="btn-2"
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      </section>
    </Modal>
  );
};
