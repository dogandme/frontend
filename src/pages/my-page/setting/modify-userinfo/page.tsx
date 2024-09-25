import {
  ChangeAgeButton,
  ChangeGenderButton,
  ChangeNickNameButton,
  ChangeRegionButton,
} from "@/features/setting/ui/ModifyUserInfo";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const ModifyUserInfoPage = () => {
  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">내 정보 수정</h1>}
      />
      <section className="flex flex-col gap-4 px-4 py-4">
        <ChangeNickNameButton />
        <ChangeGenderButton />
        <ChangeAgeButton />
        <ChangeRegionButton />
      </section>
    </>
  );
};
