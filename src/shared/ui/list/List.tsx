import { forwardRef, HTMLAttributes, LiHTMLAttributes } from "react";
import { listItemColors } from "./list.styles";

interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  isSelected?: boolean;
}

const Item = forwardRef<HTMLLIElement, ItemProps>(
  (
    { children, disabled = false, isSelected = false, onClick, ...props },
    ref,
  ) => {
    const baseStyles =
      "flex h-[3.625rem] w-full min-h-12 shrink-0 justify-center items-center gap-[.625rem] px-[.625rem] py-[1.125rem] rounded-2xl title-2 cursor-pointer";

    const { base, active, hover, focus } = listItemColors;
    const ableStyles = `${base} ${active} ${hover} ${focus}`;
    const disabledStyles = listItemColors.disabled;

    const textColorStyles = disabled
      ? "text-grey-300"
      : isSelected
        ? "text-tangerine-500"
        : "text-grey-700";

    return (
      <li
        ref={ref}
        className={`${baseStyles} ${textColorStyles} ${disabled ? disabledStyles : ableStyles}`}
        aria-disabled={disabled}
        role="listitem"
        onClick={onClick}
        {...props}
      >
        {children}
      </li>
    );
  },
);

type ListProps = HTMLAttributes<HTMLUListElement>;

const ListMain = ({ children, ...props }: ListProps) => {
  return (
    <ul className="flex w-full flex-col justify-center" role="list" {...props}>
      {children}
    </ul>
  );
};

const List = Object.assign(ListMain, {
  Item,
});

export default List;
