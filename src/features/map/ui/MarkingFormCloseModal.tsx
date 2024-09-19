import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { useMapStore } from "../store";
import { useMarkingFormStore } from "../store/form";

export const MarkingFormCloseModal = ({
  onCloseExitModal,
  onCloseMarkingModal,
}: {
  onCloseExitModal: () => Promise<void>;
  onCloseMarkingModal: () => Promise<void>;
}) => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const setMode = useMapStore((state) => state.setMode);

  return (
    <Modal modalType="center">
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <span className="title-1 text-grey-900">화면을 나가시겠습니까</span>
          <button
            onClick={onCloseExitModal}
            aria-label="게시글 나가기 확인창 닫기"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="text-grey-700 body-2">
          <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
          <p>정말 화면을 나가시겠습니까?</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="text"
            colorType="tertiary"
            size="medium"
            fullWidth={false}
            className="flex-1"
            onClick={onCloseExitModal}
          >
            취소
          </Button>
          <Button
            variant="text"
            colorType="primary"
            size="medium"
            onClick={() => {
              onCloseExitModal();
              onCloseMarkingModal();
              resetMarkingFormStore();
              setMode("view");
            }}
            fullWidth={false}
            className="flex-1"
          >
            나가기
          </Button>
        </div>
      </section>
    </Modal>
  );
};
