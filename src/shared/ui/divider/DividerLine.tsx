interface DividerLineProps {
  axis: "row" | "col";
  className?: string;
}

export const DividerLine = ({ axis, className = "" }: DividerLineProps) => {
  const baseClassName = "bg-grey-200";
  const layoutClassName =
    axis === "col" ? "w-[1px] h-[.75rem] my-auto" : "h-[1px] w-full mx-auto";

  return (
    <span className={`${baseClassName} ${layoutClassName} ${className}`}></span>
  );
};
