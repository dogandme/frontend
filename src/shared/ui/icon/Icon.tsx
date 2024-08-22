import { ElementType } from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const withIcon = (Component: ElementType) => {
  return ({ width = 24, height = 24, fill = "#9E9E9E" }: IconProps) => {
    return <Component width={width} height={height} fill={fill} />;
  };
};

export default withIcon;
