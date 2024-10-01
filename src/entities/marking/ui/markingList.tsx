import { ReactNode } from "react";

interface ContentListProps {
  children: ReactNode;
}

export const MarkingList = ({ children }: ContentListProps) => {
  return <ul className="flex flex-col gap-8">{children}</ul>;
};
