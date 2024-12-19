import { useRef, useState } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import {
  MARKING_VISIBILITY_MAP,
  MARKING_VISIBILITY_ENTRIES,
} from "@/entities/marking/constants";
import type { IsVisible } from "@/entities/marking/types/server";
import { API_BASE_URL } from "@/shared/constants";
import { useSnackBarStore } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { usePutModifyMarking, type UsePutModifyMarkingParams } from "../api";
import { MARKING_ADD_ERROR_MESSAGE, MAX_IMAGE_LENGTH } from "../constants";
import {
  type EditMarkingFormExternalState,
  EditMarkingFormProvider,
  useEditMarkingForm,
  useEditMarkingFormContext,
} from "../store";

interface EditMarkingFormModalProps {
  onClose: () => Promise<void>;
  initialState: EditMarkingFormExternalState;
  markingId: number;
  putModifyMarkingArguments: UsePutModifyMarkingParams;
}

export const EditMarkingFormModal = ({
  onClose,
  initialState,
  markingId,
  putModifyMarkingArguments,
}: EditMarkingFormModalProps) => {
  return (
    <EditMarkingFormProvider initialState={initialState}>
      <Modal modalType="center">
        <Modal.Header
          onClick={onClose}
          closeButtonAriaLabel="작성중인 임시저장된 마킹 게시글 닫기"
        >
          마킹하기
        </Modal.Header>
        <Modal.Content>
          {/* 사용자 현재 위치 */}
          <EditCurrentLocation />
          {/* 보기 권한 설정 */}
          <EditPostVisibilitySelect />
          {/* 사진 추가하기 */}
          <EditPhotoInput markingId={markingId} />
          {/* 메모하기 */}
          <EditMarkingTextArea />
        </Modal.Content>
        {/* 제출 버튼들 */}
        <Modal.Footer axis="col">
          <EditMarkingSaveButton
            markingId={markingId}
            putModifyMarkingArguments={putModifyMarkingArguments}
          />
          <EditMarkingTempSaveButton
            markingId={markingId}
            putModifyMarkingArguments={putModifyMarkingArguments}
          />
        </Modal.Footer>
      </Modal>
    </EditMarkingFormProvider>
  );
};

const EditCurrentLocation = () => {
  const store = useEditMarkingFormContext();
  return (
    <div className="flex gap-[0.625rem] items-center">
      <span className="text-tangerine-500">
        <MyLocationIcon />
      </span>
      <span className="btn-2 text-start">{store.getState().region}</span>
    </div>
  );
};

const EditPostVisibilitySelect = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isVisible = useEditMarkingForm((state) => state.isVisible);
  const setIsVisible = useEditMarkingForm((state) => state.setIsVisible);
  const handleCloseSelectList = () => setIsOpen(false);

  const handleSelect = (value: IsVisible) => {
    setIsVisible(value);
    handleCloseSelectList();
  };

  return (
    <div className="relative">
      <SelectOpener
        label="보기권한 설정"
        essential
        onClick={() => setIsOpen(!isOpen)}
        value={MARKING_VISIBILITY_MAP[isVisible]}
      />

      <Select isOpen={isOpen} onClose={handleCloseSelectList}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
        >
          {MARKING_VISIBILITY_ENTRIES.map(([key, value]) => (
            <Select.Option
              key={key}
              value={value}
              isSelected={key === isVisible}
              onClick={() => handleSelect(key)}
            >
              {value}
            </Select.Option>
          ))}
        </Select.OptionList>
      </Select>
    </div>
  );
};

const EditPhotoInput = ({
  markingId,
}: Pick<EditMarkingFormModalProps, "markingId">) => {
  const store = useEditMarkingFormContext();

  const externalImages = useEditMarkingForm((state) => state.externalImages);
  const setExternalImages = useEditMarkingForm(
    (state) => state.setExternalImages,
  );
  const setRemovedIds = useEditMarkingForm((state) => state.setRemovedIds);
  const images = useEditMarkingForm((state) => state.images);
  const setImages = useEditMarkingForm((state) => state.setImages);
  const inputKey = useEditMarkingForm((state) => state.inputKey);

  const setSnackbarProps = useSnackBarStore((state) => state.setSnackbarProps);

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
      setSnackbarProps(
        `사진은 최대 ${MAX_IMAGE_LENGTH}장까지 추가할 수 있습니다`,
      );
    }

    const availableNewFileArray = [...newFiles]
      .filter((newFile) => !images.some(({ name }) => name === newFile.name))
      .slice(0, MAX_IMAGE_LENGTH - images.length);

    setImages([
      ...images,
      ...availableNewFileArray.map((file) => ({
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
            src={`${API_BASE_URL}/markings/image/${markingId}/${imageUrl}`}
            alt={`${markingId}의 ${id}번의 이미지`}
            key={id}
            onRemove={() => {
              setExternalImages(
                externalImages.filter(
                  (externalImage) => externalImage.imageUrl !== imageUrl,
                ),
              );
              setRemovedIds([...store.getState().removedIds, id]);
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

const EditMarkingTextArea = () => {
  const store = useEditMarkingFormContext();
  const setContent = useEditMarkingForm((state) => state.setContent);

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

const EditMarkingSaveButton = ({
  markingId,
  putModifyMarkingArguments,
}: Omit<EditMarkingFormModalProps, "initialState" | "onClose">) => {
  const store = useEditMarkingFormContext();
  const setSnackbarProps = useSnackBarStore((state) => state.setSnackbarProps);
  const { mutate: putModifyTempMarking } = usePutModifyMarking(
    putModifyMarkingArguments,
  );

  const handleClick = () => {
    const {
      isCompressing,
      content,
      removedIds,
      images,
      isVisible,
      externalImages,
    } = store.getState();

    if (isCompressing) {
      setSnackbarProps("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    if (externalImages.length + images.length === 0) {
      setSnackbarProps(MARKING_ADD_ERROR_MESSAGE.MISSING_REQUIRED_FIELDS);
      return;
    }

    putModifyTempMarking({
      content: content || "",
      id: markingId,
      removeIds: removedIds,
      isTempSaved: false,
      images: images.map(({ file }) => file),
      isVisible,
    });
  };

  return (
    <Button
      colorType="primary"
      size="medium"
      variant="filled"
      type="button"
      onClick={handleClick}
    >
      저장하기
    </Button>
  );
};
const EditMarkingTempSaveButton = ({
  markingId,
  putModifyMarkingArguments,
}: Omit<EditMarkingFormModalProps, "initialState" | "onClose">) => {
  const store = useEditMarkingFormContext();
  const setSnackbarProps = useSnackBarStore((state) => state.setSnackbarProps);
  const { mutate: putModifyTempMarking } = usePutModifyMarking(
    putModifyMarkingArguments,
  );

  const handleClick = () => {
    const { isCompressing, content, removedIds, images, isVisible } =
      store.getState();

    if (isCompressing) {
      setSnackbarProps("사진을 압축 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    putModifyTempMarking({
      content: content || "",
      id: markingId,
      removeIds: removedIds,
      isTempSaved: true,
      images: images.map(({ file }) => file),
      isVisible,
    });
  };

  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      onClick={handleClick}
    >
      임시저장
    </Button>
  );
};
