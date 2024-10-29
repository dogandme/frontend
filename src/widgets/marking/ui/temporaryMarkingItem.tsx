import { DeleteTemporaryMarkingButton } from "@/features/follow/ui";
import { TempMarkingFormModal } from "@/features/marking/ui";
import { TempMarkingInfo } from "@/entities/marking/api";
import { API_BASE_URL } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { MyLocationIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";

export const TemporaryMarkingItem = ({
  region,
  isVisible,
  images,
  markingId,
  content,
}: Omit<TempMarkingInfo, "regDt">) => {
  // TODO 리팩토링 시 shared 로 옮기기
  const VISIBILITY_MAP = {
    PUBLIC: "전체 공개",
    FOLLOWERS_ONLY: "팔로우 공개",
    PRIVATE: "나만 보기",
  };

  return (
    <li className="py-4 px-4 border border-grey-300 rounded-2xl flex flex-col self-stretch">
      {/* 마킹바 헤더 */}
      <header className="flex gap-4 justify-between items-center">
        <div className="flex gap-1 text-tangerine-500">
          <MyLocationIcon />
          <p className="body-2 text-grey-500">{region}</p>
        </div>
        <div className="flex gap-2">
          <InfoChip size="small">{VISIBILITY_MAP[isVisible]}</InfoChip>
          <DeleteTemporaryMarkingButton markingId={markingId} />
        </div>
      </header>
      {/* 이미지 슬라이더 */}
      <main className="flex flex-col gap-2 mt-2">
        <ImgSlider>
          {images.map(({ imageUrl, id }, index) => (
            <ImgSlider.ImgItem
              key={id}
              src={`${API_BASE_URL}/markings/image/preview/${id}/${imageUrl}`}
              alt={`${markingId} 의 ${index + 1} 번 째 이미지 `}
            />
          ))}
        </ImgSlider>
        {/* 내용 */}
        <p className="body-2 text-grey-700 text-ellipsis line-clamp-2">
          {content}
        </p>
      </main>
      <footer className="mt-4">
        <TempMarkingModalOpenButton
          region={region}
          isVisible={isVisible}
          content={content}
          images={images}
          markingId={markingId}
        />
      </footer>
    </li>
  );
};

type TempMarkingModalOpenButtonProps = Pick<
  TempMarkingInfo,
  "region" | "isVisible" | "content" | "images" | "markingId"
>;

const TempMarkingModalOpenButton = ({
  region,
  isVisible,
  content,
  images,
  markingId,
}: TempMarkingModalOpenButtonProps) => {
  const { handleOpen, onClose } = useModal(() => (
    <TempMarkingFormModal
      onClose={onClose}
      markingId={markingId}
      initialState={{
        region,
        isVisible,
        content,
        externalImages: images,
      }}
    />
  ));

  return (
    <Button
      colorType="primary"
      size="small"
      variant="filled"
      onClick={handleOpen}
    >
      마킹 마저하기
    </Button>
  );
};
