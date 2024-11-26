import { useQueryClient } from "@tanstack/react-query";
import { ChangeNicknameModal } from "@/features/auth/ui/ChangeNicknameModal";
import { GenderChangeButton } from "@/features/setting/ui";
import { ChangeAgeButton } from "@/features/setting/ui";
import { RegionChangeButton } from "@/features/setting/ui";
import { useGetMyInfo } from "@/entities/auth/api";
import type { MyInfo } from "@/entities/auth/api";
import { useModal, withAuth } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const EditInfoPage = withAuth(() => {
  const { data: myInfo } = useGetMyInfo();

  if (!myInfo) {
    return <EditInfoLoadingPage />;
  }

  const { age, gender, regions, nickLastModDt } = myInfo;

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">내 정보 수정</h1>}
      />

      <section className="flex flex-col gap-4 px-4 py-4">
        <NicknameButton nickLastModDt={nickLastModDt!} />
        <GenderChangeButton gender={gender} />
        <ChangeAgeButton age={age} />
        <RegionChangeButton regions={regions} />
      </section>
    </>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);

const EditInfoLoadingPage = () => {
  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">내 정보 수정</h1>}
      />

      <section className="flex flex-col gap-4 px-4 py-4">
        <button className="setting-item">
          <span>닉네임 변경</span>

          <div className="flex items-center text-grey-500">
            <span className="body-2 skeleton">loading</span>
            <ArrowRightIcon />
          </div>
        </button>

        <button className="setting-item">
          <span>성별 변경</span>

          <div className="flex items-center text-grey-500">
            <span className="body-2 skeleton">남자</span>
            <ArrowRightIcon />
          </div>
        </button>

        <button className="setting-item">
          <span>나이대 변경</span>

          <div className="flex items-center text-grey-500">
            <span className="body-2 skeleton">30대</span>
            <ArrowRightIcon />
          </div>
        </button>

        <button>
          <div className="setting-item">
            <span>동네설정</span>
            <div className="text-grey-500">
              <ArrowRightIcon />
            </div>
          </div>
          <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
            {Array.from({ length: 3 }, (_, idx) => idx).map((key) => (
              <li key={key} className="flex flex-shrink-0">
                <ActionChip
                  variant="outlined"
                  isSelected={true}
                  className="skeleton"
                >
                  loading loading loading
                </ActionChip>
              </li>
            ))}
          </ul>
        </button>
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
  const queryClient = useQueryClient();

  const { handleOpen, onClose } = useModal(
    () => (
      <ChangeNicknameModal onClose={onClose} nickLastModDt={nickLastModDt} />
    ),
    {
      beforeClose: () => {
        const mutationCache = queryClient
          .getMutationCache()
          .findAll({
            mutationKey: ["changeNickname"],
          })
          .reverse()[0];

        if (mutationCache?.state.status === "pending") {
          return true;
        }
      },
    },
  );

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
