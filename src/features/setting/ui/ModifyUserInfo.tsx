import { ActionChip } from "@/shared/ui/chip";
import { ArrowRightIcon, CancelIcon } from "@/shared/ui/icon";
import { settingClassName } from "./setting.styles";

export const ChangeNickNameButton = () => {
  return (
    <button className={settingClassName}>
      <p>닉네임 변경</p>
      <p className="flex items-center">
        <span className="text-grey-700">뽀송이</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </p>
    </button>
  );
};

export const ChangeGenderButton = () => {
  return (
    <button className={settingClassName}>
      <p>성별 변경</p>
      <p className="flex items-center">
        <span className="text-grey-700">여자</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </p>
    </button>
  );
};

export const ChangeAgeButton = () => {
  return (
    <button className={settingClassName}>
      <p>나이대 변경</p>
      <p className="flex items-center">
        <span className="text-grey-700">20대</span>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </p>
    </button>
  );
};

export const ChangeRegionButton = () => {
  const address = [
    "영등포동 2가",
    "영등포동 3가",
    "영등포동 4가",
    "영등포동 5가",
    "영등포동 6가",
    "영등포동 7가",
  ];

  return (
    <section>
      <button className={settingClassName}>
        <p>동네 설정</p>
        <span className="text-grey-500">
          <ArrowRightIcon />
        </span>
      </button>
      <ul className="flex items-start gap-2 self-stretch overflow-auto pb-4">
        {address.map((region) => (
          <li className="flex flex-shrink-0" key={region}>
            <ActionChip
              variant="outlined"
              trailingIcon={<CancelIcon width={20} height={20} />}
              isSelected={true}
            >
              {region}
            </ActionChip>
          </li>
        ))}
      </ul>
    </section>
  );
};
