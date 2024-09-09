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
      <h1>Center Modal 입니다.</h1>
      <p>Modal Content</p>
      <div className="flex justify-end px-2 py-2">
        <button
          onClick={onClose}
          className="rounded-xl border px-2 py-2 text-tangerine-500"
        >
          모달 닫기
        </button>
      </div>
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
      <h1 className="text-center">FullPage Modal 입니다.</h1>
      <p className="mx-4 my-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
        dignissimos tenetur laboriosam commodi. Ducimus facilis cum autem
        consequatur, accusantium animi velit corporis minima nihil quia aliquid
        sapiente neque cumque dolore?
      </p>
      <div className="h-full">
        <div className="flex justify-end px-2 py-2">
          <button
            onClick={onClose}
            className="rounded-xl border px-2 py-2 text-tangerine-500"
          >
            모달 닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};
