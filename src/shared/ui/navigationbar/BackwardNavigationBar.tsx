import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { WardLeftIcon } from "@/shared/ui/icon";
import { NavigationBar } from "./NavigationBar";

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

export const BackwardNavigationBar = (
  props: React.HTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <NavigationBar
      componentType="buttonLeft"
      button={<BackWardButton {...props} />}
    ></NavigationBar>
  );
};
