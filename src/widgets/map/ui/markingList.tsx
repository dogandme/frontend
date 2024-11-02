import { ReactNode } from "react";

interface ContentListProps {
  display?: "grid" | "list";
  className?: string;
  children: ReactNode;
}

export const MarkingList = ({
  children,
  className = "",
  display = "list",
}: ContentListProps) => {
  const markingListStyles =
    display === "grid"
      ? "grid grid-cols-3 rounded-lg overflow-hidden"
      : "flex flex-col gap-8";

  return <ul className={`${markingListStyles} ${className}`}>{children}</ul>;
};
