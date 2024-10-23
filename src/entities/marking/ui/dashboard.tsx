import { TemporarySavedMarkingCount } from "@/entities/profile/api";
import { ArrowRightIcon, InfoIcon } from "@/shared/ui/icon";

/**
 * 사용자 대쉬보드에서 마킹들의 썸네일을 렌더링 하는 컴포넌트 입니다.
 * TODO 2024/10/23 마킹 목록 가져오는 API 가 변경 되었습니다. 이로 인해 수정해야 합니다.
 */
// export const MarkingThumbnailGrid = ({
//   markings,
// }: {
//   markings: MarkingIdList;
// }) => {
//   if (markings.length === 0) {
//     return <EmptyGalleryGrid />;
//   }

//   return (
//     <div className="grid grid-cols-3 gap-2 w-full">
//       {markings.map(({ id, image }) => (
//         <img
//           key={id}
//           src={`${API_BASE_URL}/markings/image/${id}/${image}`}
//           alt={`마킹 번호 ${id}의 썸네일 이미지`}
//           className="w-full h-full object-cover rounded-lg aspect-square"
//         />
//       ))}
//     </div>
//   );
// };

/**
 * 임시 저장된 마킹들의 정보를 받아 임시 저장된 마킹의 개수를 보여주고
 * 임시저장된 포스트를 모아둔 곳으로 라우팅 시키는 네비게이션바 입니다.
 */
export const TemporaryMarkingBar = ({
  tempCnt,
}: {
  tempCnt: TemporarySavedMarkingCount;
}) => {
  return (
    <div className="text-grey-500 flex px-4 py-4 items-center gap-[.625rem] self-stretch rounded-2xl border border-grey-50 bg-grey-50 justify-between">
      <InfoIcon width={20} height={20} />
      <p className="flex-1 title-3">
        <span>임시 저장중인 내 마킹 </span>
        <span className="text-tangerine-500">{tempCnt}</span>
      </p>
      <ArrowRightIcon width={20} height={20} />
    </div>
  );
};

const EmptyGalleryGrid = () => (
  <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
    <img
      src="/default-image.png"
      alt="profileImage"
      className="w-16 h-16 rounded-2xl flex-shrink-0 "
    />
    <div className="text-center body-2 text-grey-500">
      <p>함께 한 특별한 장소를 마킹하고</p>
      <p>추억을 남겨보세요</p>
    </div>
  </div>
);
