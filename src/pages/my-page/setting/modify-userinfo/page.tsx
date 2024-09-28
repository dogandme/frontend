import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createModifyUserInfoStore } from "@/features/setting/store";
import type { ModifyUserInfoFormState } from "@/features/setting/store";
import {
  ChangeAgeButton,
  ChangeGenderButton,
  ChangeNickNameButton,
  ChangeRegionButton,
} from "@/features/setting/ui/ModifyUserInfo";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const ModifyUserInfoPage = () => {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  useEffect(() => {
    if (!role || role === "ROLE_NONE") {
      navigate(ROUTER_PATH.MY_PAGE);
    }
  }, [role, navigate]);

  if (!role || role === "ROLE_NONE") {
    return;
  }

  // TODO userInfo Store 나오면 스토어에서 가져오기
  const initialState: Omit<ModifyUserInfoFormState, "_nicknameInput"> = {
    nickname: "뽀송이",
    gender: "여자",
    age: "20대",
    regionList: [
      "영등포동 1가",
      "영등포동 2가",
      "영등포동 3가",
      "영등포동 4가",
      "영등포동 5가",
    ],
  };

  const store = createModifyUserInfoStore(initialState);

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">내 정보 수정</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <ChangeNickNameButton store={store} />
        <ChangeGenderButton store={store} />
        <ChangeAgeButton store={store} />
        <ChangeRegionButton store={store} />
      </section>
    </>
  );
};
