export const EmptyMyMarkingThumbnailGrid = () => {
  return (
    <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
      <img
        src="/default-image.png"
        alt="profileImage"
        className="w-16 h-16 rounded-2xl flex-shrink-0 "
      />
      <div className="text-center body-2 text-grey-500">
        <p>함께한 특별한 장소를 마킹하고</p>
        <p>추억을 남겨보세요</p>
      </div>
    </div>
  );
};

export const EmptyMarkingThumbnailGrid = () => (
  <div className="px-4 py-4 flex items-center justify-center flex-col gap-4 w-full h-[20.5rem] rounded-2xl bg-grey-50">
    <img
      src="/default-image.png"
      alt="profileImage"
      className="w-16 h-16 rounded-2xl flex-shrink-0 "
    />
    <p className="text-center body-2 text-grey-500">마킹이 없습니다</p>
  </div>
);
