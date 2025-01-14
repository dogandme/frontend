import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icon";
import { NavigationBar } from "./navigationBar";

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

interface CloseNavigationBarProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string;
}

export const CloseNavigationBar = ({
  children,
  ...props
}: CloseNavigationBarProps) => {
  const navigate = useNavigate();

  return (
    <NavigationBar justifyContent="between">
      <h1>{children}</h1>
      <CloseButton onClick={() => navigate(-1)} {...props} />
    </NavigationBar>
  );
};
