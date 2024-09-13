import { FloatingButton } from "@/entities/map/ui";
import { useModal } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import {
  ExitIcon,
  LocationIcon,
  MyLocationIcon,
  StarIcon,
} from "@/shared/ui/icon";
import { MarkingFormModal } from "./MarkingFormModal";

/* ----------default mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingEditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={onClick}
    >
      <span className="btn-3">마킹하기</span>
    </Button>
  );
};

export const MyLocationButton = () => {
  return (
    <FloatingButton aria-label="지도의 중심을 현재 위치로 이동시키기">
      <MyLocationIcon />
    </FloatingButton>
  );
};

export const ShowOthersMarkingButton = () => {
  return (
    <FloatingButton aria-label="현재 보고 있는 지도의 마킹들 나타내기">
      <LocationIcon />
    </FloatingButton>
  );
};

export const CollectionButton = () => {
  return (
    <FloatingButton aria-label="좋아요 버튼을 눌렀거나 저장한 마킹들 나타내기">
      <StarIcon />
    </FloatingButton>
  );
};

/* ----------edit mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingFormTriggerButton = () => {
  const { handleOpen, onClose } = useModal(() => (
    <MarkingFormModal onClose={onClose} />
  ));

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleOpen}
    >
      <span className="btn-3">여기에 마킹하기</span>
    </Button>
  );
};

export const ExitEditModeButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <FloatingButton onClick={onClick} aria-label="마커 추가 모드 종료하기">
      <ExitIcon />
    </FloatingButton>
  );
};
