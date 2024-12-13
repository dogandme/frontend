import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/shared/constants";
import { ArrowRightIcon, InfoIcon } from "@/shared/ui/icon";

interface TemporaryMarkingBarProps {
  tempCnt: number;
}
/**
 * 임시 저장된 마킹들의 정보를 받아 임시 저장된 마킹의 개수를 보여주고
 * 임시저장된 포스트를 모아둔 곳으로 라우팅 시키는 네비게이션바 입니다.
 */
export const TemporaryMarkingBar = ({ tempCnt }: TemporaryMarkingBarProps) => {
  return (
    <Link
      className="text-grey-500 flex px-4 py-4 items-center gap-[.625rem] self-stretch rounded-2xl border border-grey-50 bg-grey-50 justify-between"
      to={ROUTER_PATH.TEMPORARY_MARKING}
    >
      <InfoIcon width={20} height={20} />
      <p className="flex-1 title-3">
        <span>임시 저장중인 내 마킹 </span>
        <span className="text-tangerine-500">{tempCnt}</span>
      </p>
      <ArrowRightIcon width={20} height={20} />
    </Link>
  );
};
