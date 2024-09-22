import { Button } from "@/shared/ui/button";
import { DropDownIcon } from "@/shared/ui/icon";

export const ProfileOverView = () => {
  return (
    <section className="px-4 py-4 flex flex-col gap-4 rounded-2xl border border-grey-300 bg-grey-50">
      <div className="flex gap-4 self-stretch">
        {/* 프로필 이미지 */}
        <img
          src="/default-image.png"
          alt="profile"
          className="w-16 h-16 rounded-[28px]"
        />
        {/* 프로필 정보 */}
        <div className="flex flex-col gap-1 items-start self-stretch">
          <h1 className="text-grey-900 title-2">뽀송송</h1>
          <h2 className="text-grey-500 body-3">비숑프리제</h2>
          <p className="text-grey-700 body-3 flex gap-2">
            <span>
              팔로워 <span className="text-grey-900">4</span>
            </span>
            <div className="w-[1px] h-3 bg-grey-200"></div>
            <span className="text-grey-900">팔로잉 4</span>
          </p>
        </div>
        {/* 팔로워 팔로잉 액션칩 */}
        <div className="flex flex-grow justify-end">
          <Button
            colorType="tertiary"
            size="xSmall"
            variant="outlined"
            fullWidth={false}
          >
            팔로잉
          </Button>
        </div>
      </div>
      {/* Pet description */}
      <div className="flex gap-4 self-stretch text-grey-500 body-2">
        <p className="text-ellipsis overflow-hidden text-nowrap ">
          안녕하세요 진짜로 너무나도 귀여운 강아지입니다. 사람을 좋아하고 이름은
          뽀송인데 뽀송송이라고 불러요
        </p>
        <button className="w-4 h-4">
          <DropDownIcon />
        </button>
      </div>
      {/* 캐릭터 성격 칩 */}
      <div className="flex gap-1 self-stretch flex-wrap items-center content-center">
        <span className="px-4 rounded-2xl bg-tangerine-500 h-8 flex items-center justify-center text-grey-50 text-center btn-3">
          활동적인
        </span>
        <span className="px-4 rounded-2xl bg-tangerine-500 h-8 flex items-center justify-center text-grey-50 text-center btn-3">
          사교적인
        </span>
        <span className="px-4 rounded-2xl bg-tangerine-500 h-8 flex items-center justify-center text-grey-50 text-center btn-3">
          온순한
        </span>
      </div>
    </section>
  );
};
