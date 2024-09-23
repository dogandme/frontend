import type { AuthStore } from "@/shared/store";
import { ArrowRightIcon, InfoIcon } from "@/shared/ui/icon";

interface TemporaryMarkingBarProps extends Pick<AuthStore, "role"> {
  temporaryMarkingList: string[];
}

export const TemporaryMarkingBar = ({
  role,
  temporaryMarkingList,
}: TemporaryMarkingBarProps) => {
  if (role !== "ROLE_USER" || temporaryMarkingList.length === 0) {
    return;
  }

  return (
    <div className="text-grey-500 flex px-4 py-4 items-center gap-[.625rem] self-stretch rounded-2xl border border-grey-50 bg-grey-50 justify-between">
      <InfoIcon width={20} height={20} />
      <p className="flex-1 title-3">
        <span>임시 저장중인 내 마킹 </span>
        <span className="text-tangerine-500">
          {temporaryMarkingList.length}
        </span>
      </p>
      <ArrowRightIcon width={20} height={20} />
    </div>
  );
};
