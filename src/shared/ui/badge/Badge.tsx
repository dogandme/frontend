import { baseStyles } from "./badge.styles";

interface BadgeProps {
  colorType: "primary" | "secondary";
  variant: "dot" | "num" | "text";
  number?: number;
  text?: string;
}

const Badge = ({ variant, colorType, number, text }: BadgeProps) => {
  const colorStyles =
    colorType === "primary" ? "bg-tangerine-500" : "bg-grey-900";

  if (variant === "dot") {
    return <div className={`${baseStyles.dot} ${colorStyles} `}></div>;
  }

  const textStyles = "text-grey-0 body-3";

  if (variant === "num") {
    if (number === undefined)
      throw new Error("variant가 num인 경우 number를 필수로 설정해야 합니다.");

    return (
      <div className={`${baseStyles.num} ${colorStyles} ${textStyles}`}>
        {number}
      </div>
    );
  }

  if (text === undefined)
    throw new Error("variant가 text인 경우 text를 필수로 설정해야 합니다.");

  return (
    <div className={`${baseStyles.text} ${colorStyles} ${textStyles}`}>
      {text}
    </div>
  );
};

export default Badge;
