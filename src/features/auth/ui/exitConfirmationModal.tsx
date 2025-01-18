import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";

interface EditMarkingFormModalProps {
  onClose: () => Promise<void>;
}

export const ExitConfirmationModal = ({
  onClose,
}: EditMarkingFormModalProps) => {
  const navigate = useNavigate();

  return (
    <Modal modalType="center" className="gap-8">
      <header className="flex justify-between">
        <h1 className="title-1 text-grey-900">정말 나가시겠나요?</h1>
        <button aria-label="모달 닫는 버튼" onClick={onClose}>
          <CloseIcon />
        </button>
      </header>

      <p className="body-2 text-grey-700">
        페이지를 벗어나면 입력한 정보들을 모두 잃게 됩니다. 그래도 나가실건가요?
      </p>

      <div className="flex gap-2">
        <Button
          variant="text"
          colorType="tertiary"
          size="medium"
          fullWidth={false}
          className="flex-1"
          onClick={() => {
            navigate(ROUTER_PATH.LOGIN);
            onClose();
          }}
        >
          나갈래요
        </Button>
        <Button
          variant="text"
          colorType="primary"
          size="medium"
          onClick={onClose}
          fullWidth={false}
          className="flex-1"
        >
          유지할게요
        </Button>
      </div>
    </Modal>
  );
};
