import { ButtonHTMLAttributes, useRef } from "react";
import { Badge } from "@/shared/ui/badge";
import { ArrowDropDownIcon } from "@/shared/ui/icon";

interface SelectOpenerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  essential?: boolean;
  placeholder?: string;
}

export const SelectOpener = ({
  label,
  essential = false,
  placeholder = "",
  value,
  disabled,
  ...props
}: SelectOpenerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLabelClick = () => {
    buttonRef.current?.focus();
    buttonRef.current?.click();
  };

  const isValueEmpty = value === undefined || value === "";

  const baseStyles = `body-2 flex h-12 w-full items-center justify-between gap-1 rounded-2xl border px-3 py-2 ${disabled && "cursor-not-allowed"}`;
  const colorStyles =
    "border-grey-300 bg-grey-0 hover:border-grey-500 hover:bg-grey-100 focus:border-tangerine-500 focus:bg-grey-0 focus-visible:outline-none disabled:border-grey-100 disabled:bg-grey-0";
  const textStyles = `body-2 ${disabled ? "text-grey-300" : !isValueEmpty ? "text-grey-700" : "text-grey-500"}`;

  return (
    <div>
      {/* label */}
      <div
        className="flex w-fit cursor-pointer gap-1 pb-2"
        onClick={handleLabelClick}
      >
        <p className="title-3 text-grey-700">{label}</p>
        {essential && <Badge colorType="primary" />}
      </div>

      {/* trigger */}
      <button
        ref={buttonRef}
        type="button"
        className={`${baseStyles} ${colorStyles} ${textStyles}`}
        disabled={disabled}
        {...props}
      >
        <span>{isValueEmpty ? placeholder : value}</span>
        <ArrowDropDownIcon />
      </button>
    </div>
  );
};
