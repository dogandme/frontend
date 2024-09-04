import { useEffect } from "react";
import { useOverlay } from "@/shared/lib/overlay";

/**
 * 사용법 예시
 * 다양한 오버레이들을 정의합니다. 오버레이들은 필수 props로 onClose를 필수적으로 받아야 합니다.
 */

interface ModalProps {
  handleClose: () => void;
}

const ConfirmModal = ({ handleClose }: ModalProps) => {
  /**
   * 가끔씩 어떤 오버레이는 다른 오버레이를 호출 하기도 합니다.
   * ConfirmModal은 저장 시 저장이 완료되었단 스낵바를 렌더링 해야 합니다.
   * ConfirmModal은 트리거 되는 오버레이면서, 다른 오버레이를 트리거 하는 컴포넌트 이기도 합니다.
   */
  const { handleClose: SnackbarClose, handleOpen: SnackbarOpen } = useOverlay(
    () => <SaveSnackbar handleClose={SnackbarClose} />,
    {
      disabledInteraction: false, // 스낵바의 경우엔 interaction을 중지시키지 않을 것입니다.
    },
  );

  // 모달의 비즈니스 로직과 상위에서 정의된 onClose 메소드를 사용합니다.
  const handleSave = () => {
    // 비즈니스 로직..
    handleClose();
    SnackbarOpen(); // 다른 오버레이를 호출합니다.
  };

  const handleExit = () => {
    handleClose();
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform bg-grey-100 px-12 py-12">
      <p>나가시겠습니까?</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={handleSave} className="text-tangerine-500">
          저장하고 나가기
        </button>
        <button onClick={handleExit}>그냥 나가기</button>
      </div>
    </div>
  );
};

/**
 * 해당 스낵바는 노출 이후 1초 뒤 자동으로 사라집니다.
 */
const SaveSnackbar = ({ handleClose }: ModalProps) => {
  useEffect(() => {
    setTimeout(() => {
      handleClose();
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
  const { isOpen, handleClose, handleOpen } = useOverlay(() => (
    <ConfirmModal handleClose={handleClose} />
  ));

  return (
    <div className="flex items-center justify-center bg-tangerine-400 px-2 py-2">
      <button onClick={() => (isOpen ? handleClose() : handleOpen())}>
        {isOpen ? "열려있음" : "모달 열기"}
      </button>
    </div>
  );
};

/**
 * 모달을 중첩적으롭 불러와 사용하는 경우를 연출합니다
 */

const FirstNestedModal = ({ handleClose }: ModalProps) => {
  const { handleClose: secondHandleClose, handleOpen } = useOverlay(() => (
    <SecondNestedModal handleClose={secondHandleClose} />
  ));

  return (
    <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform bg-grey-100 px-12 py-12">
      <p>첫번째 모달</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={handleOpen}>두 번째 모달 열기</button>
        <button onClick={handleClose}>닫기</button>
      </div>
    </div>
  );
};

const SecondNestedModal = ({ handleClose }: ModalProps) => {
  return (
    <div className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 transform bg-grey-200 px-12 py-12">
      <p>두번째 모달</p>
      <div className="mt-2 flex justify-between border-tangerine-50 px-2 py-2">
        <button onClick={handleClose}>닫기</button>
      </div>
    </div>
  );
};

export const NestedModalTrigger = () => {
  const { isOpen, handleClose, handleOpen } = useOverlay(() => (
    <FirstNestedModal handleClose={handleClose} />
  ));

  return (
    <div className="flex items-center justify-center bg-tangerine-400 px-2 py-2">
      <button onClick={() => (isOpen ? handleClose() : handleOpen())}>
        {isOpen ? "열려있음" : "중첩 모달 열기"}
      </button>
    </div>
  );
};
