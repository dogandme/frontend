import { ReactNode } from "react";

interface ContentListProps {
  display?: "grid" | "list";
  children: ReactNode;
}

export const MarkingList = ({
  children,
  display = "list",
}: ContentListProps) => {
  const className =
    display === "grid"
      ? "grid grid-cols-3 rounded-lg overflow-hidden"
      : "flex flex-col gap-8";

  return <ul className={className}>{children}</ul>;
};
