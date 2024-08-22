import { useNavigate } from "react-router-dom";
import { WardLeftIcon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import { NavigationBar } from "@/shared/ui/navigationbar";

<<<<<<< HEAD
const BackWardButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

=======
const BackWardButton = () => {
  const navigate = useNavigate();
>>>>>>> d5c9c2c (feat[#52] : BackwardNavigationBar 위젯 생성)
  return (
    <Button
      size="large"
      variant="text"
      colorType="tertiary"
<<<<<<< HEAD
      onClick={onClick || (() => navigate(-1))}
      fullWidth={false}
      {...rest}
=======
      onClick={() => navigate(-1)}
>>>>>>> d5c9c2c (feat[#52] : BackwardNavigationBar 위젯 생성)
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
