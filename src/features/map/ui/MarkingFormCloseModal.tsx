import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { MarkingModalText, MarkingModalLabel } from "../constants";
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
          <span className="title-1 text-grey-900">
            {MarkingModalText.closeMarkingModalTitle}
          </span>
          <button
            onClick={onCloseExitModal}
            aria-label={MarkingModalLabel.confirmModalCancelButton}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="text-grey-700 body-2">
          <p>{MarkingModalText.closeMarkingModalText1}</p>
          <p>{MarkingModalText.closeMarkingModalText2}</p>
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
            {MarkingModalText.closeMarkingModalCancelButton}
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
            {MarkingModalText.closeMarkingModalConfirmButton}
          </Button>
        </div>
      </section>
    </Modal>
  );
};
