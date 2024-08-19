import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  colorType: "primary" | "secondary" | "tertiary";
  variant: "filled" | "outlined" | "text";
  size: "xSmall" | "small" | "medium" | "large" | "xLarge";
};

const Button = ({ ...props }: Props) => {
  return (
    <button
      className="inline-flex flex-shrink-0 items-center justify-center gap-[.625rem] rounded-[1rem]"
      {...props}
    >
      Button
    </button>
  );
};

export default Button;
