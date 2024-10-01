import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";

type Role = null | "NONE" | "GUEST" | "USER";

/**
 * 해당 훅은 /:nickname/setting .. 이하에서 사용자가 permission 을 가지는지 가지지 않는지를 판단하기 위한 훅입니다.
 * 만약 permission 을 가지지 않는다면, 해당 페이지로 접근할 수 없으며 /:nickname 으로 redirect 됩니다.
 * @param boundary 허용 가능한 권한의 최소 범위를 이야기 합니다. 예를 들어 boundary 가 NONE 이라면 NONE 이상 부터 Permission을 갖습니다.
 */
export const useSettingPermission = (boundary: Role = "NONE") => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const urlNickname = decodeURIComponent(pathname.split("/")[1]);

  let hasPermission: boolean = false;
  switch (boundary) {
    case null:
      hasPermission = true;
      break;
    case "NONE":
      hasPermission = role !== null;
      break;
    case "GUEST":
      hasPermission =
        (role === "ROLE_GUEST" || role === "ROLE_USER") &&
        nickname === urlNickname;
      break;
    case "USER":
      hasPermission = role === "ROLE_USER" && nickname === urlNickname;
      break;
    default:
      hasPermission = false;
  }

  useEffect(() => {
    if (!hasPermission) {
      navigate(ROUTER_PATH.MY_PAGE);
    }
  }, [hasPermission, nickname, navigate]);

  return hasPermission;
};
