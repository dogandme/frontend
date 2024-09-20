import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { NavigationBar, NavigationBarProps } from "./NavigationBar";

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

type CloseNavigationBarProps = Omit<
  NavigationBarProps,
  "componentType" | "button"
>;

export const CloseNavigationBar = (props: CloseNavigationBarProps) => {
  const navigate = useNavigate();
  const { onClick, label, ...rest } = props;

  return (
    <NavigationBar
      componentType="buttonRight"
      button={
        <CloseButton onClick={onClick || (() => navigate(-1))} {...rest} />
      }
      label={label}
    />
  );
};
