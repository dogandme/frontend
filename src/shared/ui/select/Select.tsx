import { ReactNode } from "react";
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
