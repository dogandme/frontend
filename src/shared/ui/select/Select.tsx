import { ReactNode, useEffect } from "react";
import { SelectContext, SelectContextType } from "./select.context";
import SelectBottomSheet from "./SelectBottomSheet";
import OptionList from "./OptionList";
import Option from "./Option";

const SelectMain = ({
  isOpen,
  onClose,
  children,
}: SelectContextType & {
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
    <SelectContext.Provider value={{ isOpen, onClose }}>
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
