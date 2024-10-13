import { MyInfo, useGetMyInfo } from "@/entities/auth/api";
import { useAuthStore } from "@/shared/store";
import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon } from "@/shared/ui/icon";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const EditInfoPage = () => {
  const token = useAuthStore((state) => state.token);
  const { data: myInfo } = useGetMyInfo({ token });

  if (!myInfo) {
    return null;
  }

  const { age, gender, regions } = myInfo;

  return (
    <>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-700">내 정보 수정</h1>}
      />

      <section className="flex flex-col gap-4 px-4 py-4">
        <NicknameButton />
        <GenderButton gender={gender} />
        <AgeButton age={age} />
        <RegionSettingButton regions={regions} />
      </section>
    </>
  );
};

const NicknameButton = () => {
  const nickname = useAuthStore((state) => state.nickname);

  return (
    <button className="setting-item">
      <span>닉네임 변경</span>

      <div className="flex items-center text-grey-500">
        <span className="body-2">{nickname}</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const GenderButton = ({ gender }: Pick<MyInfo, "gender">) => {
  return (
    <button className="setting-item">
      <span>성별 변경</span>

      <div className="flex items-center text-grey-500">
        <span className="body-2">{gender === "MALE" ? "남자" : "여자"}</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const AgeButton = ({ age }: Pick<MyInfo, "age">) => {
  return (
    <button className="setting-item">
      <span>나이대 변경</span>

      <div className="flex items-center text-grey-500">
        <span className="body-2">{age}</span>
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const RegionSettingButton = ({ regions }: Pick<MyInfo, "regions">) => {
  return (
    <button>
      <div className="setting-item">
        <span>동네설정</span>

        <div className="text-grey-500">
          <ArrowRightIcon />
        </div>
      </div>

      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {regions.map(({ id, subDistrict }) => (
          <ActionChip key={id} variant="outlined" isSelected={true}>
            {subDistrict}
          </ActionChip>
        ))}
      </ul>
    </button>
  );
};