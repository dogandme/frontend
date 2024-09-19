import { FloatingButton } from "@/entities/map/ui";
import { MapSnackbar } from "@/entities/map/ui/MapSnackbar";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { Button } from "@/shared/ui/button";
import {
  ExitIcon,
  LocationIcon,
  MyLocationIcon,
  StarIcon,
} from "@/shared/ui/icon";
import { MarkingModalLabel, MarkingModalText } from "../constants";
import { useMapStore } from "../store";
import { MarkingFormModal } from "./MarkingFormModal";

/* ----------default mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingAddButton = () => {
  const setMode = useMapStore((state) => state.setMode);

  const { handleOpen, onClose } = useSnackBar(() => (
    <MapSnackbar onClose={onClose} autoHideDuration={5000}>
      {MarkingModalText.markingEditSnackbar}
    </MapSnackbar>
  ));

  const handleClick = () => {
    handleOpen();
    setMode("add");
  };

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleClick}
    >
      <span className="btn-3">{MarkingModalText.markingEditButton}</span>
    </Button>
  );
};

export const MyLocationButton = () => {
  return (
    <FloatingButton aria-label={MarkingModalLabel.MyLocationButton}>
      <MyLocationIcon />
    </FloatingButton>
  );
};

export const ShowOthersMarkingButton = () => {
  return (
    <FloatingButton aria-label={MarkingModalLabel.ShowOthersMarkingButton}>
      <LocationIcon />
    </FloatingButton>
  );
};

export const CollectionButton = () => {
  return (
    <FloatingButton aria-label={MarkingModalLabel.CollectionButton}>
      <StarIcon />
    </FloatingButton>
  );
};

/* ----------add mode 일 때 나타나는 버튼들입니다.---------- */
export const MarkingFormTriggerButton = () => {
  const { handleOpen, onClose: onCloseMarkingModal } = useModal(() => (
    <MarkingFormModal onCloseMarkingModal={onCloseMarkingModal} />
  ));

  return (
    <Button
      colorType="primary"
      variant="filled"
      size="medium"
      onClick={handleOpen}
    >
      <span className="btn-3">{MarkingModalText.markingFormTriggerButton}</span>
    </Button>
  );
};

export const ExitAddModeButton = () => {
  const setMode = useMapStore((state) => state.setMode);
  const handleClick = () => {
    setMode("view");
  };
  return (
    <FloatingButton
      onClick={handleClick}
      aria-label={MarkingModalLabel.exitEditButton}
    >
      <ExitIcon />
    </FloatingButton>
  );
};
