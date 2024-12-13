import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { WardLeftIcon } from "@/shared/ui/icon";
import { NavigationBar } from "./navigationBar";

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
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string;
}

export const BackwardNavigationBar = ({
  children,
  ...props
}: BackwardNavigationBarProps) => {
  return (
    <NavigationBar>
      <BackWardButton {...props} />
      {children}
    </NavigationBar>
  );
};
