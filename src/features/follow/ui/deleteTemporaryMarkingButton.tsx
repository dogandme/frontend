import type { TempMarkingInfo } from "@/entities/marking/api";
import { useModal } from "@/shared/lib";
import { DeleteIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { useDeleteTemporaryMarking } from "../api/deleteTemporaryMarking";

type DeleteTemporaryMarkingButtonProps = Pick<TempMarkingInfo, "markingId">;

export const DeleteTemporaryMarkingButton = ({
  markingId,
}: DeleteTemporaryMarkingButtonProps) => {
  const { handleOpen, onClose } = useModal(() => (
    <DeleteTemporaryMarkingModal onClose={onClose} markingId={markingId} />
  ));

  return (
    <button
      aria-label={`임시 저장 된 ${markingId} 지우기 버튼`}
      onClick={handleOpen}
    >
      <DeleteIcon />
    </button>
  );
};

interface DeleteTemporaryMarkingModalProps
  extends DeleteTemporaryMarkingButtonProps {
  onClose: () => Promise<void>;
}

const DeleteTemporaryMarkingModal = ({
  onClose,
  markingId,
}: DeleteTemporaryMarkingModalProps) => {
  const { mutate: deleteTemporaryMarking } = useDeleteTemporaryMarking();

  return (
    <Modal modalType="center">
      <Modal.Header onClick={onClose}>삭제하기</Modal.Header>
      <Modal.Content>
        <div className="flex flex-col body-2 text-grey-700">
          <p>삭제된 임시저장 마킹은 다시 불러올수 없습니다.</p>
          <p>임시저장 마킹을 정말 삭제하시겠습니까?</p>
        </div>
      </Modal.Content>
      <Modal.Footer axis="row">
        <Modal.TextButton onClick={onClose} colorType="tertiary">
          아니요
        </Modal.TextButton>
        <Modal.TextButton
          onClick={() => {
            deleteTemporaryMarking({ id: markingId });
            onClose();
          }}
        >
          네, 삭제 할게요
        </Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};
