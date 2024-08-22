import { useNavigate } from "react-router-dom";
import { WardLeftIcon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import { NavigationBar } from "@/shared/ui/navigationbar";

const BackWardButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      size="large"
      variant="text"
      colorType="tertiary"
      onClick={() => navigate(-1)}
    >
      <WardLeftIcon fill="#616161" />
    </Button>
  );
};

const BackwardNavigationBar = () => {
  return (
    <NavigationBar
      componentType="buttonLeft"
      button={<BackWardButton />}
    ></NavigationBar>
  );
};

export default BackwardNavigationBar;
