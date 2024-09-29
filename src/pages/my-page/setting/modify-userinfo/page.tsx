import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createModifyUserInfoStore } from "@/features/setting/store";
import type { ModifyUserInfoFormState } from "@/features/setting/store";
import {
  ChangeAgeButton,
  ChangeGenderButton,
  ChangeNicknameButton,
  ChangeRegionButton,
} from "@/features/setting/ui/ModifyUserInfo";
import { ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const ModifyUserInfoPage = () => {
  // 권한에 따라 사용자의 접근을 제한합니다.
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
    region: [
      { id: 1, address: "영등포동 1가" },
      { id: 2, address: "영등포동 2가" },
      { id: 3, address: "영등포동 3가" },
      { id: 4, address: "영등포동 4가" },
      { id: 5, address: "영등포동 5가" },
    ],
  };

  // modifyUserInfoFormStore 는 해당 페이지가 마운트 될 때 생성되는 store 입니다.
  // userInfoStore에 저장된 상태 값을 초기 값으로 가지며 해당 페이지에서만 사용됩니다.
  // 위와 같이 생성 한 이유는 해당 페이지에서만 form 의 역할로 사용되기 때문입니다.
  // 페이지가 언마운트 될 시 가비지 컬렉터에 의해 메모리에서 제거 됩니다.
  const modifyUserInfoFormStore = createModifyUserInfoStore(initialState);

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">내 정보 수정</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <ChangeNicknameButton store={modifyUserInfoFormStore} />
        <ChangeGenderButton store={modifyUserInfoFormStore} />
        <ChangeAgeButton store={modifyUserInfoFormStore} />
        <ChangeRegionButton store={modifyUserInfoFormStore} />
      </section>
    </>
  );
};
