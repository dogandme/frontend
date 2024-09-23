import React from "react";
import { infoChipStyles } from "./chip.styles";

interface InfoChipProps {
  children: React.ReactNode | [React.ReactNode, React.ReactNode];
  size: keyof typeof infoChipStyles.size;
  className?: string;
}

export const InfoChip = ({ children, size, className = "" }: InfoChipProps) => {
  const isTextOnly = Array.isArray(children) ? "isNotTextOnly" : "isTextOnly";

  const { base } = infoChipStyles;
  const paddingClassName = infoChipStyles.padding[isTextOnly];
  const sizeClassName = infoChipStyles.size[size];

  return (
    <span
      className={`${base} ${paddingClassName} ${sizeClassName} ${className}`}
    >
      {children}
    </span>
  );
};
