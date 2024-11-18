import { useState, useEffect, useRef } from "react";
import { useMarkingFormModal } from "@/features/marking/lib";
import { DeleteTemporaryMarkingButton } from "@/features/marking/ui";
import { EditMarkingFormModal } from "@/features/marking/ui";
import { TempMarkingInfo } from "@/entities/marking/api";
import { MARKING_VISIBILITY_MAP } from "@/entities/marking/constants";
import { API_BASE_URL } from "@/shared/constants";
import { Button } from "@/shared/ui/button";
import { InfoChip } from "@/shared/ui/chip/InfoChip";
import { MyLocationIcon } from "@/shared/ui/icon";
import { DropDownIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";

export const TemporaryMarkingItem = ({
  region,
  isVisible,
  images,
  markingId,
  content,
}: Omit<TempMarkingInfo, "regDt">) => {
  return (
    <li className="py-4 px-4 border border-grey-300 rounded-2xl flex flex-col self-stretch">
      {/* 마킹바 헤더 */}
      <header className="flex gap-4 justify-between items-center">
        <div className="flex gap-1 text-tangerine-500">
          <MyLocationIcon />
          <p className="body-2 text-grey-500">{region}</p>
        </div>
        <div className="flex gap-2">
          <InfoChip size="small">{MARKING_VISIBILITY_MAP[isVisible]}</InfoChip>
          <DeleteTemporaryMarkingButton markingId={markingId} />
        </div>
      </header>
      {/* 이미지 슬라이더 */}
      <main className="flex flex-col gap-2 mt-2">
        <ImgSlider>
          {images.map(({ imageUrl, id }, index) => (
            <ImgSlider.ImgItem
              key={id}
              src={`${API_BASE_URL}/markings/image/${markingId}/${imageUrl}`}
              alt={`${markingId} 의 ${index + 1} 번 째 이미지 `}
            />
          ))}
        </ImgSlider>
        {/* 내용 */}
        {content && (
          <TempMarkingContent content={content} markingId={markingId} />
        )}
      </main>
      <footer className="mt-4">
        <EditMarkingModalOpenButton
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

const TempMarkingContent = ({
  content,
  markingId,
}: {
  content: NonNullable<TempMarkingInfo["content"]>;
  markingId: TempMarkingInfo["markingId"];
}) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isEllipsis, setIsEllipsis] = useState<boolean>(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // 줄바꿈이 적용된 배열
  const multiLineContent = content.split("\n");
  const isMultiLine = multiLineContent.length > 1;

  const renderMarkingContent = () => {
    if (isMultiLine) {
      return isSummary
        ? multiLineContent[0]
        : multiLineContent.map((line, index) => (
            <p className="min-h-4" key={index}>
              {line}
            </p>
          ));
    }
    return content;
  };

  useEffect(() => {
    const $p = contentRef.current!;
    setIsEllipsis($p.scrollWidth > $p.clientWidth);
  }, []);

  return (
    <div className="flex gap-4 text-grey-700">
      <p
        className={`body-2  ${isSummary ? "text-ellipsis overflow-hidden text-nowrap" : ""}`}
        ref={contentRef}
      >
        {renderMarkingContent()}
      </p>
      {(isMultiLine || isEllipsis) && (
        <button
          className="w-4 h-4 "
          onClick={() => setIsSummary((prev) => !prev)}
          aria-label={
            isSummary
              ? `${markingId} 번 마킹 내용 더 보기`
              : `${markingId} 번 마킹 내용 접기`
          }
        >
          <DropDownIcon />
        </button>
      )}
    </div>
  );
};

type EditMarkingModalOpenButtonProps = Pick<
  TempMarkingInfo,
  "region" | "content" | "images" | "markingId" | "isVisible"
>;

const EditMarkingModalOpenButton = ({
  region,
  isVisible,
  content,
  images,
  markingId,
}: EditMarkingModalOpenButtonProps) => {
  const { handleOpen, onClose } = useMarkingFormModal(() => (
    <EditMarkingFormModal
      onClose={onClose}
      markingId={markingId}
      initialState={{
        region,
        isVisible,
        content,
        externalImages: images,
      }}
      putModifyMarkingArgumets={{
        endPoint: "PUT_MODIFY_TEMP_MARKING",
        queryKeys: ["markingList"],
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
