import { createContext, useContext } from "react";

export interface SelectContextType {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SelectContext = createContext<null | SelectContextType>(null);

export const useSelectContext = () => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("useSelectContext must be used within a SelectProvider");
  }

  return context;
};
