import { useState, useEffect } from "react";
import { useOverlay } from "@/shared/lib/overlay";
import { Modal } from "../modal";

/**
 * 사용법 예시
 * 다양한 오버레이들을 정의합니다. 오버레이들은 필수 props로 onClose를 필수적으로 받아야 합니다.
 */

interface ModalProps {
  onClose: () => void | Promise<void>;
}

const ConfirmModal = ({ onClose }: ModalProps) => {
  /**
   * 가끔씩 어떤 오버레이는 다른 오버레이를 호출 하기도 합니다.
   * ConfirmModal은 저장 시 저장이 완료되었단 스낵바를 렌더링 해야 합니다.
   * ConfirmModal은 트리거 되는 오버레이면서, 다른 오버레이를 트리거 하는 컴포넌트 이기도 합니다.
   */
  const { onClose: closeSnackbar, handleOpen: openSnackbar } = useOverlay(
    () => <SaveSnackbar onClose={closeSnackbar} />,
    {
      disableInteraction: false, // 스낵바의 경우엔 interaction을 중지시키지 않을 것입니다.
    },
  );

  // 모달의 비즈니스 로직과 상위에서 정의된 onClose 메소드를 사용합니다.
  const handleSave = () => {
    // 비즈니스 로직..
    onClose();
    openSnackbar(); // 다른 오버레이를 호출합니다.
  };
  const handleExit = () => {
    onClose();
  };

  return (
    <Modal modalType="center">
      <Modal.Header onClick={onClose}>화면을 나가시겠습니까?</Modal.Header>
      <Modal.Content>
        <div className="text-grey-700 body-2">
          <p>화면을 나갈 경우 입력한 정보들이 모두 삭제 됩니다.</p>
          <p>정말 화면을 나가시겠습니까?</p>
        </div>
      </Modal.Content>
      <Modal.Footer axis="row">
        <Modal.TextButton onClick={handleExit}>나가기</Modal.TextButton>
        <Modal.FilledButton onClick={handleSave}>저장하기</Modal.FilledButton>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * 해당 스낵바는 노출 이후 1초 뒤 자동으로 사라집니다.
 */
const SaveSnackbar = ({ onClose }: ModalProps) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 1000);
  });

  return (
    <div className="absolute left-1/2 top-4 -translate-x-1/2 transform border px-2 py-2">
      저장이 되었습니다
    </div>
  );
};

/* 오버레이를 호출시키는 컴포넌트를 만들어봅시다. */

export const ModalTrigger = () => {
  const { isOpen, onClose, handleOpen } = useOverlay(() => (
    <ConfirmModal onClose={onClose} />
  ));

  return (
    <div className="flex items-center justify-center bg-tangerine-400 px-2 py-2">
      <button onClick={() => (isOpen ? onClose() : handleOpen())}>
        {isOpen ? "열려있음" : "모달 열기"}
      </button>
    </div>
  );
};

/**
 * 모달을 중첩적으롭 불러와 사용하는 경우를 연출합니다
 */

const FirstNestedModal = ({ onClose }: ModalProps) => {
  const { onClose: secondonClose, handleOpen } = useOverlay(() => (
    <SecondNestedModal onClose={secondonClose} />
  ));

  return (
    <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform bg-grey-100 px-12 py-12">
      <p>첫번째 모달</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={handleOpen}>두 번째 모달 열기</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const SecondNestedModal = ({ onClose }: ModalProps) => {
  return (
    <div className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 transform bg-grey-200 px-12 py-12">
      <p>두번째 모달</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export const NestedModalTrigger = () => {
  const { isOpen, onClose, handleOpen } = useOverlay(() => (
    <FirstNestedModal onClose={onClose} />
  ));

  return (
    <div className="flex items-center justify-center bg-tangerine-400 px-2 py-2">
      <button onClick={() => (isOpen ? onClose() : handleOpen())}>
        {isOpen ? "열려있음" : "중첩 모달 열기"}
      </button>
    </div>
  );
};

/** Close Handler 사용 예시
 * 24/09/05 추가 된 closeHandler 사용 예시입니다.
 * 오버레이의 경우 마운트 되기 전,후에 작업 하고 싶은 내용들이 존재 할 수 있습니다.
 * 예를 들어 애니메이션 효과를 위해 클래스 명을 추가하고 제거하거나, 오버레이가 떠있는 시간을 서버에게 전송하거나 싶을 수 있습니다.
 * 그 때 사용하는 option 이 closeHandler 입니다.
 */
export const AnimationModalTrigger = () => {
  const { isOpen, onClose, handleOpen } = useOverlay(
    () => <AnimationModal onClose={onClose} />,
    {
      beforeClose: async () => {
        const modal = document.getElementById("animation-modal")!;
        modal.style.transition = "opacity 1s ease-in-out";
        modal.style.opacity = "0";
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
  );

  return (
    <div className="flex items-center justify-center bg-tangerine-400 px-2 py-2">
      <button onClick={() => (isOpen ? onClose() : handleOpen())}>
        {isOpen ? "열려있음" : "모달 열기"}
      </button>
    </div>
  );
};

export const AnimationModal = ({ onClose }: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 모달이 열릴 때 애니메이션 적용
    setIsAnimating(true);
  }, []);

  const baseClassName = `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-grey-100 px-12 py-12`;
  const animationClassName = isAnimating
    ? "transform scale-100 -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-in-out"
    : "transform scale-0 -translate-x-1/2 -translate-y-1/2";

  return (
    <div
      id="animation-modal"
      className={`${baseClassName} ${animationClassName}`}
    >
      <p>안녕하세요 저는 모달이예요</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};
