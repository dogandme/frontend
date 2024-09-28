import { ModifyUserInfoFormStoreProvider } from "@/features/setting/store";
import type { ModifyUserInfoFormState } from "@/features/setting/store";
import {
  ChangeAgeButton,
  ChangeGenderButton,
  ChangeNickNameButton,
  ChangeRegionButton,
} from "@/features/setting/ui/ModifyUserInfo";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const ModifyUserInfoPage = () => {
  // TODO userInfo Store 나오면 스토어에서 가져오기
  const initialState: ModifyUserInfoFormState = {
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

  return (
    <ModifyUserInfoFormStoreProvider initialState={initialState}>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">내 정보 수정</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <ChangeNickNameButton />
        <ChangeGenderButton />
        <ChangeAgeButton />
        <ChangeRegionButton />
      </section>
    </ModifyUserInfoFormStoreProvider>
  );
};
