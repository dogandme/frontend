import { ChangeNicknameModal } from "@/features/auth/ui/ChangeNicknameModal";
import { GenderChangeButton } from "@/features/setting/ui";
import { ChangeAgeButton } from "@/features/setting/ui";
import { RegionChangeButton } from "@/features/setting/ui";
import { useGetMyInfo } from "@/entities/auth/api";
import type { MyInfo } from "@/entities/auth/api";
import { useModal } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const EditInfoPage = () => {
  const role = useAuthStore((state) => state.role);
  const { data: myInfo } = useGetMyInfo();

  if (!myInfo) return null;

  const { age, gender, regions, nickLastModDt } = myInfo;

  const hasPermission =
    (role === "ROLE_GUEST" || role === "ROLE_USER") &&
    age !== null &&
    gender !== null &&
    regions.length > 0 &&
    nickLastModDt !== null;

  if (!hasPermission) return null;

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">내 정보 수정</h1>}
      />

      <section className="flex flex-col gap-4 px-4 py-4">
        <NicknameButton nickLastModDt={nickLastModDt} />
        <GenderChangeButton gender={gender} />
        <ChangeAgeButton age={age} />
        <RegionChangeButton regions={regions} />
      </section>
    </>
  );
};

const NicknameButton = ({
  nickLastModDt,
}: {
  nickLastModDt: NonNullable<MyInfo["nickLastModDt"]>;
}) => {
  const nickname = useAuthStore((state) => state.nickname);

  const { handleOpen, onClose } = useModal(() => (
    <ChangeNicknameModal onClose={onClose} nickLastModDt={nickLastModDt} />
  ));

  return (
    <button className="setting-item" onClick={handleOpen}>
      <span>닉네임 변경</span>

      <div className="flex items-center text-grey-500">
        <span className="body-2">{nickname}</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};
