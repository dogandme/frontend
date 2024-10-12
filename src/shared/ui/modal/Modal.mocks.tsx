import { Modal } from "./Modal";

/**
 * 만약 특별한 애니메이션이나 beforeClose를 사용하고 싶다면 마운트 된 모달을 찾을 수 있는 식별자를 추가해주세요
 */
export const CenterModal = ({
  onClose,
  id,
}: {
  onClose: () => Promise<void>;
  id: string;
}) => {
  return (
    <Modal modalType="center" id={id}>
      <Modal.Header onClick={onClose}>CenterModal</Modal.Header>
      <Modal.Content>
        <p>CenterModal 입니다.</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          dignissimos tenetur laboriosam commodi.
        </p>
      </Modal.Content>
      <Modal.Footer axis="col">
        <Modal.FilledButton
          onClick={() => {
            console.log("저장!");
            onClose();
          }}
        >
          저장
        </Modal.FilledButton>
        <Modal.TextButton onClick={onClose}>취소</Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};

export const FullPageModal = ({
  onClose,
}: {
  onClose: () => Promise<void>;
}) => {
  return (
    <Modal modalType="fullPage">
      <Modal.Header onClick={onClose}>FullPageModal</Modal.Header>
      <Modal.Content>
        <p>버튼은 Stacked 형태 입니다.</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
          temporibus recusandae consectetur culpa adipisci minus, corporis ab
          excepturi tempora magni, sed possimus nesciunt est, sunt non debitis
          maxime porro neque.
        </p>
      </Modal.Content>
      <Modal.Footer axis="row">
        <Modal.FilledButton
          onClick={() => {
            console.log("저장!");
            onClose();
          }}
        >
          저장
        </Modal.FilledButton>
        <Modal.TextButton onClick={onClose}>취소</Modal.TextButton>
      </Modal.Footer>
    </Modal>
  );
};
