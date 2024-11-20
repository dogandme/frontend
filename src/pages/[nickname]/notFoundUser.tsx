import { Link, useRouteError } from "react-router-dom";
import {
  AUTH_ERROR_MESSAGE,
  MASCOT_IMAGE_URL,
  NOT_FOUND_ERROR_MESSAGE,
} from "@/shared/constants";
import { useRouteHistoryStore } from "@/shared/store/history";

export const NotFoundUser = () => {
  const error = useRouteError();

  if (
    error instanceof Error &&
    Object.values(AUTH_ERROR_MESSAGE).includes(error.message)
  ) {
    throw new Error(error.message);
  }

  if (error instanceof Error && error.message === NOT_FOUND_ERROR_MESSAGE) {
    throw new Error(NOT_FOUND_ERROR_MESSAGE);
  }

  const lastNoneAuthPage = useRouteHistoryStore(
    (state) => state.lastNoneAuthRoute,
  );

  return (
    <section className="flex flex-col gap-4 bg-grey-50 items-center flex-1 self-stretch justify-center">
      <img
        src={MASCOT_IMAGE_URL}
        alt="멍윗미 마스코트 이미지"
        className="w-16 h-16 rounded-[1.75rem]"
      />
      <div className="flex flex-col gap-1">
        <h1 className="title-1 text-grey-700 text-center">
          사용자를 찾을 수 없어요
        </h1>
        <p className="flex flex-col body-2 text-grey-500 text-center">
          <span>찾으시는 사용자의 계정이 변경 또는 삭제로</span>
          <span>페이지를 찾을 수 없습니다.</span>
        </p>
      </div>
      <Link
        to={lastNoneAuthPage}
        className="px-4 h-8 flex justify-center items-center rounded-2xl bg-grey-900 text-grey-0 btn-3 text-center"
      >
        이전으로
      </Link>
    </section>
  );
};
