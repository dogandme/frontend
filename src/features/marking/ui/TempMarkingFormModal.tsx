import { useRef, useState } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import { TempMarkingInfo } from "@/entities/marking/api";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { MAX_IMAGE_LENGTH, POST_VISIBILITY_MAP } from "../constants";
import {
  TempMarkingFormExternalState,
  TempMarkingFormProvider,
  useTempMarkingForm,
  useTempMarkingFormContext,
} from "../store";

interface TempMarkingFormModalProps {
  onClose: () => Promise<void>;
  initialState: TempMarkingFormExternalState;
}

export const TempMarkingFormModal = ({
  onClose,
  initialState,
}: TempMarkingFormModalProps) => {
  return (
    <TempMarkingFormProvider initialState={initialState}>
      <Modal modalType="center">
        <Modal.Header
          onClick={onClose}
          closeButtonAriaLabel="작성중인 임시저장된 마킹 게시글 닫기"
        >
          마킹하기
        </Modal.Header>
        <Modal.Content>
          {/* 사용자 현재 위치 */}
          <TempCurrentLocation />
          {/* 보기 권한 설정 */}
          <TempPostVisibilitySelect />
          {/* 사진 추가하기 */}
          <TempPhotoInput />
          {/* 메모하기 */}
          <TempMarkingTextArea />
        </Modal.Content>
        {/* 제출 버튼들 */}
        <Modal.Footer axis="col">
          <TempMarkingSaveButton />
          <TempMarkingTempSaveButton />
        </Modal.Footer>
      </Modal>
    </TempMarkingFormProvider>
  );
};

const TempCurrentLocation = () => {
  const store = useTempMarkingFormContext();
  return (
    <div className="flex gap-[0.625rem] items-center">
      <span className="text-tangerine-500">
        <MyLocationIcon />
      </span>
      <span className="btn-2 text-start">{store.getState().region}</span>
    </div>
  );
};

const TempPostVisibilitySelect = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isVisible = useTempMarkingForm((state) => state.isVisible);
  const setIsVisible = useTempMarkingForm((state) => state.setIsVisible);

  const VISIBILITY_ENTRIES = Object.entries(POST_VISIBILITY_MAP);
  const handleCloseSelectList = () => setIsOpen(false);

  const handleSelect = (value: TempMarkingInfo["isVisible"]) => {
    setIsVisible(value);
    handleCloseSelectList();
  };

  return (
    <div className="relative">
      <SelectOpener
        label="보기권한 설정"
        essential
        onClick={() => setIsOpen(!isOpen)}
        value={
          VISIBILITY_ENTRIES.find(([_, value]) => value === isVisible)?.[0]
        }
      />

      <Select isOpen={isOpen} onClose={handleCloseSelectList}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
        >
          {VISIBILITY_ENTRIES.map(([name, value]) => {
            return (
              <Select.Option
                key={name}
                value={value}
                isSelected={value === isVisible}
                onClick={() =>
                  handleSelect(value as TempMarkingInfo["isVisible"])
                }
              >
                {name}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </div>
  );
};

const TempPhotoInput = () => {
  const externalImages = useTempMarkingForm((state) => state.externalImages);
  const setExternalImages = useTempMarkingForm(
    (state) => state.setExternalImages,
  );

  const images = useTempMarkingForm((state) => state.images);
  const setImages = useTempMarkingForm((state) => state.setImages);
  const inputKey = useTempMarkingForm((state) => state.inputKey);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentImagesLength = externalImages.length + images.length;

  const handleOpenAlbum = () => {
    inputRef.current?.click();
  };

  const handleChange = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = target;

    if (!newFiles) {
      return;
    }

    if (currentImagesLength + newFiles.length > MAX_IMAGE_LENGTH) {
      // TODO 에러 바운더리에서 처리 하기
      // throw new Error(`사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`);
      console.error(`사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`);
    }

    const AvailableNewFileArray = [...newFiles]
      .filter((newFile) => !images.some(({ name }) => name === newFile.name))
      .slice(0, MAX_IMAGE_LENGTH - images.length);

    setImages([
      ...images,
      ...AvailableNewFileArray.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleRemoveImage = (name: string) => {
    setImages(images.filter((image) => image.name !== name));
  };

  return (
    <div>
      {/* 사진을 담을 input , sr-only로 실제 화면에 렌더링 되지 않음*/}
      <input
        key={inputKey}
        type="file"
        accept=".jpeg,.jpg,.png,.webp"
        multiple
        className="sr-only"
        ref={inputRef}
        id="images"
        name="images"
        onChange={handleChange}
      />
      {/* label */}
      <label htmlFor="images">
        <div className="flex gap-1 pb-1">
          <span className="title-3 text-grey-700">사진 추가하기</span>
          <span>
            <Badge colorType="primary" />
          </span>
        </div>
      </label>
      <ImgSlider>
        {currentImagesLength < 5 && (
          <ImgSlider.Item
            onClick={handleOpenAlbum}
            aria-label="임시저장된 마킹 게시글에 사진 추가하기"
          >
            <PlusIcon />
          </ImgSlider.Item>
        )}
        {/* 기존에 존재하던 이미지 */}
        {externalImages.map(({ imageUrl, id }) => (
          <ImgSlider.ImgItem
            src={imageUrl}
            alt="external image"
            key={id}
            onRemove={() => {
              setExternalImages(
                externalImages.filter(
                  (externalImage) => externalImage.imageUrl !== imageUrl,
                ),
              );
            }}
          />
        ))}
        {/* 임시 저장 마킹에서 새로 담긴 사진들 */}
        {images.map(({ url, name }) => (
          <ImgSlider.ImgItem
            src={url}
            alt={name}
            key={name}
            onRemove={() => handleRemoveImage(name)}
          />
        ))}
      </ImgSlider>
    </div>
  );
};

const TempMarkingTextArea = () => {
  const store = useTempMarkingFormContext();
  const setContent = useTempMarkingForm((state) => state.setContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <TextArea
      id="content"
      name="content"
      label="메모하기"
      placeholder="마킹에 대한 메모를 남겨주세요"
      defaultValue={store.getState().content || ""}
      onChange={handleChange}
    />
  );
};

const TempMarkingSaveButton = () => {
  // const store = useTempMarkingFormContext();

  return (
    <Button
      colorType="primary"
      size="medium"
      variant="filled"
      type="button"
      // onClick={handleSave}
    >
      저장하기
    </Button>
  );
};
const TempMarkingTempSaveButton = () => {
  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      // onClick={handleSave}
    >
      임시저장
    </Button>
  );
};
