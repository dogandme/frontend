import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { NavigationBar } from "@/shared/ui/navigationbar";
import { CloseIcon } from "@/shared/ui/icon";

const CloseButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      size="large"
      variant="text"
      colorType="tertiary"
      fullWidth={false}
      {...props}
    >
      <CloseIcon fill="#616161" />
    </Button>
  );
};

export const CloseNavigationBar = (
  props: React.HTMLAttributes<HTMLButtonElement>,
) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

  return (
    <NavigationBar
      componentType="buttonRight"
      button={
        <CloseButton onClick={onClick || (() => navigate(-1))} {...rest} />
      }
    ></NavigationBar>
  );
};
