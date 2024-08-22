import { baseStyles } from "./badge.styles";

interface BadgeProps {
  colorType: "primary" | "secondary";
  children?: string;
}

const Badge = ({ colorType, children }: BadgeProps) => {
  const colorStyles =
    colorType === "primary" ? "bg-tangerine-500" : "bg-grey-900";

  const isDot = children === undefined;

  if (isDot) {
    return <div className={`${baseStyles.dot} ${colorStyles} `}></div>;
  }

  const textStyles = "text-grey-0 body-3";

  const isNum = /^[0-9]+$/.test(children);

  return (
    <div
      className={`${isNum ? baseStyles.num : baseStyles.text} ${colorStyles} ${textStyles}`}
    >
      {children}
    </div>
  );
};

export default Badge;
