import { useNavigate } from "react-router-dom";
import { WardLeftIcon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import { NavigationBar } from "@/shared/ui/navigationbar";

const BackWardButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

  return (
    <Button
      size="large"
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

const BackwardNavigationBar = (
  props: React.HTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <NavigationBar
      componentType="buttonLeft"
      button={<BackWardButton {...props} />}
    ></NavigationBar>
  );
};

export default BackwardNavigationBar;
