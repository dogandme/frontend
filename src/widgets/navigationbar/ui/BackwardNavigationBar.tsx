import { useNavigate } from "react-router-dom";
import { WardLeftIcon } from "@/shared/ui/icon";
import { Button } from "@/shared/ui/button";
import { NavigationBar } from "@/shared/ui/navigationbar";

<<<<<<< HEAD
<<<<<<< HEAD
const BackWardButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

=======
const BackWardButton = () => {
  const navigate = useNavigate();
>>>>>>> d5c9c2c (feat[#52] : BackwardNavigationBar 위젯 생성)
=======
const BackWardButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { onClick, ...rest } = props;

>>>>>>> c8a9411 (feat[#52] : BackwardNavigationBar onClick props 설정)
  return (
    <Button
      size="large"
      variant="text"
      colorType="tertiary"
<<<<<<< HEAD
<<<<<<< HEAD
      onClick={onClick || (() => navigate(-1))}
      fullWidth={false}
      {...rest}
=======
      onClick={() => navigate(-1)}
>>>>>>> d5c9c2c (feat[#52] : BackwardNavigationBar 위젯 생성)
=======
      onClick={onClick || (() => navigate(-1))}
      fullWidth={false}
      {...rest}
>>>>>>> c8a9411 (feat[#52] : BackwardNavigationBar onClick props 설정)
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
