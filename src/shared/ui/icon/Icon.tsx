import { ElementType } from "react";
import { colors } from "@/shared/constants";

type Colors = typeof colors;
type ColorKey = keyof Colors;
type ShadeKey = keyof Colors[ColorKey];

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const withIcon = (Component: ElementType) => {
  return ({ width = 24, height = 24, fill = colors.grey[500] }: IconProps) => {
    const isHex = fill.match(/^#[0-9A-F]{6}$/i);

    if (isHex) {
      return <Component width={width} height={height} fill={fill} />;
    }

    const [colorKey, shade] = fill.split("-") as [ColorKey, ShadeKey];

    if (!colors[colorKey] || !colors[colorKey][shade]) {
      throw new Error("아이콘 색상을 hex 또는 theme 색상으로 지정해주세요.");
    }

    const iconColor = colors[colorKey][shade];

    return <Component width={width} height={height} fill={iconColor} />;
  };
};

export default withIcon;
