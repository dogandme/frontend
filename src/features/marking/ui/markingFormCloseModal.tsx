import { useOverlayStore } from "@/shared/store/overlay";
import { Modal } from "@/shared/ui/modal";
import { useMapStore } from "../../map/store";
import { useMarkingFormStore } from "../store";

export const MarkingFormCloseModal = ({
  onCloseExitModal,
}: {
  onCloseExitModal: () => Promise<void>;
}) => {
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );
  const resetOverlays = useOverlayStore((state) => state.resetOverlays);
  const setMode = useMapStore((state) => state.setMode);

  return (
    <Modal modalType="center">
      <Modal.Header
        onClick={onCloseExitModal}
        closeButtonAriaLabel="게시글 나가기 확인창 닫기"
      >
        화면을 나가시겠습니까?
      </Modal.Header>
      <Modal.Content>
        <div className="text-grey-700 body-2">
          <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다</p>
          <p>정말 화면을 나가시겠습니까?</p>
        </div>
      </Modal.Content>
      <Modal.Footer axis="row">
        <Modal.TextButton onClick={onCloseExitModal} colorType="tertiary">
          취소
        </Modal.TextButton>
        <Modal.TextButton
          onClick={() => {
            resetOverlays();
            resetMarkingFormStore();
            setMode("view");
          }}
        >
          나가기
        </Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};
