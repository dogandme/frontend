import { ReactNode } from "react";
import { Sheet } from "react-modal-sheet";
import { useSelectContext } from "./select.context";

interface SelectBottomSheetProps {
  children: ReactNode;
}

const SelectBottomSheet = ({ children }: SelectBottomSheetProps) => {
  const { id, isOpen, onClose } = useSelectContext();

  return (
    <Sheet id={id} isOpen={isOpen} onClose={onClose} detent="content-height">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};

export default SelectBottomSheet;
