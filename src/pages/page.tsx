import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTER_PATH.MAP);
  }, []);

  return null;
};

export default MainPage;
