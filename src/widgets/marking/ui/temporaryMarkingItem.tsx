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
}: {
  content: NonNullable<TempMarkingInfo["content"]>;
  markingId: TempMarkingInfo["markingId"];
}) => {
  const [isSummary, setIsSummary] = useState<boolean>(true);
  const [isMultiLineSummaryEllipsis, setIsMultiLineSummaryEllipsis] =
    useState<boolean>(false);

  const contentRef = useRef<HTMLParagraphElement>(null);
  const multiLineSummaryRef = useRef<HTMLParagraphElement>(null);

  // 줄바꿈이 적용된 배열
  const multiLineContent = content.split("\n");
  const isMultiLine = multiLineContent.length > 1;

  const renderMarkingContent = () => {
    if (isMultiLine) {
      return isSummary ? (
        <>
          <p className="body-2 min-h-4 text-ellipsis overflow-hidden text-nowrap">
            {multiLineContent[0]}
          </p>
          <p
            className="body-2 min-h-4 text-ellipsis overflow-hidden text-nowrap"
            ref={multiLineSummaryRef}
          >
            {multiLineContent[1]}
            {!isMultiLineSummaryEllipsis && "..."}
          </p>
        </>
      ) : (
        multiLineContent.map((line, index) => (
          <p className="min-h-4" key={index}>
            {line}
          </p>
        ))
      );
    }
    return content;
  };

  // 멀티 라인의 두 번째 줄에는 필수적으로 ... 를 붙혀 하위에 렌더링 되지 않은 줄이 있음을 표현 해줍니다.
  // 이를 위해 멀티라인의 두 번쨰 줄이 ellipsis 되었는지 확인하고 , 그렇지 않다면 인위적으로 ...을 붙혀주기 위해 상태를 변경합니다.
  useEffect(() => {
    const $multiLineSummaryText = multiLineSummaryRef.current;

    if ($multiLineSummaryText) {
      setIsMultiLineSummaryEllipsis(
        $multiLineSummaryText.scrollWidth > $multiLineSummaryText.clientWidth,
      );
    }
  }, []);

  return (
    <p
      className={`body-2  text-grey-700 ${isSummary ? "line-clamp-2 text-ellipsis overflow-hidden" : ""}`}
      ref={contentRef}
      onClick={() => setIsSummary((prev) => !prev)}
    >
      {renderMarkingContent()}
    </p>
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
