import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { WardLeftIcon } from "@/shared/ui/icon";
import { NavigationBar } from "./NavigationBar";
import type { NavigationBarProps } from "./NavigationBar";

const BackWardButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

  return (
    <Button
      size="medium"
      variant="text"
      colorType="tertiary"
      onClick={onClick || (() => navigate(-1))}
      fullWidth={false}
      {...rest}
    >
      <WardLeftIcon fill="#616161" />
    </Button>
  );
};

interface BackwardNavigationBarProps
  extends Partial<Pick<NavigationBarProps, "label">> {
  rest?: React.HTMLAttributes<HTMLButtonElement>;
}

export const BackwardNavigationBar = ({
  label,
  rest,
}: BackwardNavigationBarProps) => {
  return (
    <NavigationBar
      componentType="buttonLeft"
      button={<BackWardButton {...rest} />}
      label={label}
    ></NavigationBar>
  );
};
