import { ReactNode, useEffect } from "react";
import Option from "./Option";
import OptionList from "./OptionList";
import SelectBottomSheet from "./SelectBottomSheet";
import { SelectContext, SelectContextType } from "./select.context";

const SelectMain = ({
  id,
  isOpen,
  onClose,
  children,
}: SelectContextType & {
  id?: string;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ id, isOpen, onClose }}>
      {children}
    </SelectContext.Provider>
  );
};

const Select = Object.assign(SelectMain, {
  BottomSheet: SelectBottomSheet,
  OptionList,
  Option,
});

export default Select;
