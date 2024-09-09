import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { NavigationBar } from "./NavigationBar";

const CloseButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      size="large"
      variant="text"
      colorType="tertiary"
      fullWidth={false}
      {...props}
    >
      <CloseIcon fill="grey-700" />
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