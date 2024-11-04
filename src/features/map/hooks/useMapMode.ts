import { useLocation } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";

type MapMode = "MAP" | "PLACE" | "MY_MARK" | "MY_ACTIVITY";

export const useMapMode = (): MapMode | null => {
  const { pathname } = useLocation();

  if (pathname === ROUTER_PATH.MAP) return "MAP";
  if (pathname === ROUTER_PATH.PLACE) return "PLACE";
  if (pathname === ROUTER_PATH.MY_MARK) return "MY_MARK";
  if (pathname === ROUTER_PATH.MY_ACTIVITY) return "MY_ACTIVITY";

  return null;
};
