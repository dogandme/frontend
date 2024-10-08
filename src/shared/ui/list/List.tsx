import { forwardRef, HTMLAttributes, LiHTMLAttributes } from "react";
import { listItemStyles } from "./list.styles";

interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  className?: string;
}

export const Item = forwardRef<HTMLLIElement, ItemProps>(
  ({ children, disabled = false, onClick, className, ...props }, ref) => {
    const baseStyles =
      "flex h-[3.625rem] w-full min-h-12 shrink-0 justify-center items-center gap-[.625rem] px-[.625rem] py-[1.125rem] rounded-2xl title-2";

    const { base, active, hover, focus } = listItemStyles;
    const ableStyles = `${base} ${active} ${hover} ${focus}`;
    const disabledStyles = listItemStyles.disabled;

    return (
      <li
        ref={ref}
        className={`${baseStyles} ${disabled ? disabledStyles : ableStyles} ${className}`}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) return;

          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </li>
    );
  },
);

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  className?: string;
}

const ListMain = ({ children, className, ...props }: ListProps) => {
  return (
    <ul
      className={`flex w-full flex-col justify-center ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
};

const List = Object.assign(ListMain, {
  Item,
});

export default List;
