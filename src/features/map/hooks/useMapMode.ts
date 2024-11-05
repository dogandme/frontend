import { useLocation } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";

export const useMapMode = () => {
  const { pathname } = useLocation();

  const mapMode = {
    [ROUTER_PATH.MAP]: "MAP",
    [ROUTER_PATH.PLACE]: "PLACE",
    [ROUTER_PATH.MY_MARK]: "MY_MARK",
    [ROUTER_PATH.MY_ACTIVITY]: "MY_ACTIVITY",
  } as const;

  if (pathname in mapMode) {
    return mapMode[pathname as keyof typeof mapMode];
  }

  return null;
};
