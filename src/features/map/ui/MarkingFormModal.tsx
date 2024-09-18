import { useEffect, useRef, useState } from "react";
import { SelectOpener } from "@/entities/auth/ui";
import { MapSnackbar } from "@/entities/map/ui/MapSnackbar";
import { useModal, useSnackBar } from "@/shared/lib/overlay";
import { useAuthStore } from "@/shared/store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CloseIcon, MyLocationIcon, PlusIcon } from "@/shared/ui/icon";
import { ImgSlider } from "@/shared/ui/imgSlider";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/textarea";
import { useGetAddressFromLatLng } from "../api";
import { usePostMarkingForm, usePostTempMarkingForm } from "../api/form";
import { POST_VISIBILITY_MAP, PostVisibilityKey } from "../constants";
import {
  MarkingModalText,
  MarkingModalLabel,
  MarkingModalError,
} from "../constants";
import { useMarkingFormStore } from "../store/form";
import { useMapStore } from "../store/map";
import { MarkingFormCloseModal } from "./MarkingFormCloseModal";

interface MarkingFormModalProps {
  onCloseMarkingModal: () => Promise<void>;
}

const MarkingModalNav = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const { onClose: onCloseExitModal, handleOpen: onOpenExitModal } = useModal(
    () => (
      <MarkingFormCloseModal
        onCloseExitModal={onCloseExitModal}
        onCloseMarkingModal={onCloseMarkingModal}
      />
    ),
  );

  return (
    <header className="flex justify-between">
      <h1 className="title-1">{MarkingModalText.confirmModalTitle}</h1>
      <button
        onClick={onOpenExitModal}
        aria-label={MarkingModalLabel.confirmModalCloseButton}
      >
        <CloseIcon />
      </button>
    </header>
  );
};

const CurrentLocation = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const { center } = useMapStore((state) => state.mapInfo);
  const { lat, lng } = center;

  const { data, isSuccess } = useGetAddressFromLatLng({ lat, lng });
  const setRegion = useMarkingFormStore((state) => state.setRegion);

  useEffect(() => {
    if (!data && !isSuccess) {
      return;
    }
    setRegion(data.region);
  }, [data, isSuccess, setRegion]);

  return (
    <button onClick={onCloseMarkingModal}>
      <p className="flex gap-[0.625rem]">
        <span className="text-tangerine-500">
          <MyLocationIcon />
        </span>
        {isSuccess ? (
          <span className="btn-2">{data.region}</span>
        ) : (
          <span className="animate-pulse w-44 bg-grey-200 rounded-2xl"></span>
        )}
      </p>
    </button>
  );
};

const PostVisibilitySelect = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const VISIBILITY_LIST = Object.keys(
    POST_VISIBILITY_MAP,
  ) as PostVisibilityKey[];

  const visibility = useMarkingFormStore((state) => state.visibility);
  const setVisibility = useMarkingFormStore((state) => state.setVisibility);

  const onCloseSelectList = () => setIsOpen(false);

  const handleSelect = (value: PostVisibilityKey) => {
    setVisibility(value);
    onCloseSelectList();
  };

  return (
    <div className="relative">
      <SelectOpener
        label={MarkingModalLabel.postVisibility}
        essential
        onClick={() => setIsOpen(!isOpen)}
        placeholder={MarkingModalText.postVisibilityPlaceHolder}
        value={visibility}
      />

      <Select isOpen={isOpen} onClose={onCloseSelectList}>
        <Select.OptionList
          className={` ${isOpen ? "visible" : "hidden"} rounded-2xl shadow-custom-1 absolute top-[calc(100%+0.5rem)] w-full bg-grey-0 z-[9999]`}
        >
          {VISIBILITY_LIST.map((option, idx) => {
            return (
              <Select.Option
                key={idx}
                value={option}
                isSelected={option === visibility}
                onClick={() => handleSelect(option)}
              >
                {option}
              </Select.Option>
            );
          })}
        </Select.OptionList>
      </Select>
    </div>
  );
};

const PhotoInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = useMarkingFormStore((state) => state.images);
  const setImages = useMarkingFormStore((state) => state.setImages);

  // imageUrls 는 이미지 파일을 렌더링 하기 위해 사용되며 lastModified 는 images 내부 파일들을
  // 식별 하기 위한 식별자로 사용됩니다.
  const imageUrls = images.map((image) => ({
    url: URL.createObjectURL(image),
    lastModified: image.lastModified,
    name: image.name,
  }));

  const handleOpenAlbum = () => {
    inputRef.current?.click();
  };

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = target;
    if (!newFiles) {
      return;
    }

    // TODO 이미지 파일 최적화 위해 용량 줄이기

    const isImageAlreadyExist = (newFile: File) => {
      return images.some(
        (image) => image.lastModified === newFile.lastModified,
      );
    };

    const _images = [...images];
    for (const newFile of newFiles) {
      if (_images.length > 5) {
        throw new Error(MarkingModalError.maxPhotoCount);
      }

      if (!isImageAlreadyExist(newFile)) {
        _images.push(newFile);
      }
    }

    setImages([..._images]);
  };

  const handleRemoveImage = (lastModified: number) => {
    setImages(images.filter((image) => image.lastModified !== lastModified));
  };

  return (
    <div>
      {/* 사진을 담을 input , sr-only로 실제 화면에 렌더링 되지 않음*/}
      <input
        type="file"
        accept=".jpeg,.jpg,.png,.webp"
        multiple
        max={5}
        className="sr-only"
        ref={inputRef}
        id="images"
        name="images"
        onChange={handleChange}
      />
      {/* label */}
      <label htmlFor="images">
        <div className="flex gap-1 pb-1">
          <span className="title-3 text-grey-700">
            {MarkingModalText.photoInputButton}
          </span>
          <span>
            <Badge colorType="primary" />
          </span>
        </div>
      </label>
      {/* 담긴 사진들 */}
      <ImgSlider>
        {imageUrls.length < 5 && (
          <ImgSlider.Item
            onClick={handleOpenAlbum}
            aria-label={MarkingModalLabel.photoInputAddButton}
          >
            <PlusIcon />
          </ImgSlider.Item>
        )}
        {imageUrls.map(({ url, name, lastModified }, idx) => (
          <ImgSlider.ImgItem
            src={url}
            alt={name}
            key={idx}
            onRemove={() => handleRemoveImage(lastModified)}
          />
        ))}
      </ImgSlider>
    </div>
  );
};

const MarkingTextArea = () => {
  const { content } = useMarkingFormStore.getState();
  const setContent = useMarkingFormStore((state) => state.setContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <TextArea
      id="content"
      name="content"
      label={MarkingModalLabel.markingTextArea}
      placeholder={MarkingModalText.markingTextAreaPlaceholder}
      defaultValue={content}
      onChange={handleChange}
    />
  );
};

const SaveButton = ({ onCloseMarkingModal }: MarkingFormModalProps) => {
  const { center } = useMapStore((state) => state.mapInfo);
  const setMode = useMapStore((state) => state.setMode);
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );

  const { handleOpen: onOpenSnackbar, onClose: onCloseSnackbar } = useSnackBar(
    () => (
      <MapSnackbar onClose={onCloseSnackbar}>
        {MarkingModalText.saveMarkingSnackbar}
      </MapSnackbar>
    ),
  );

  const { mutate: postMarkingData } = usePostMarkingForm();

  const handleSave = () => {
    const { token } = useAuthStore.getState();

    if (!token) {
      throw new Error(MarkingModalError.unAuthorized);
    }

    const formObj = useMarkingFormStore.getState();

    const { region, visibility, images } = formObj;

    if (!region) {
      throw new Error(MarkingModalError.regionNotFound);
    }

    if (!visibility || images.length === 0) {
      throw new Error(MarkingModalError.missingRequiredFields);
    }

    postMarkingData(
      { token, ...center, ...formObj },
      {
        onSuccess: () => {
          onCloseMarkingModal();
          resetMarkingFormStore();
          setMode("view");
          onOpenSnackbar();
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      },
    );
  };

  return (
    <Button
      colorType="primary"
      size="medium"
      variant="filled"
      type="button"
      onClick={handleSave}
    >
      {MarkingModalText.saveButton}
    </Button>
  );
};
const TemporarySaveButton = ({
  onCloseMarkingModal,
}: MarkingFormModalProps) => {
  const { center } = useMapStore((state) => state.mapInfo);
  const setMode = useMapStore((state) => state.setMode);
  const resetMarkingFormStore = useMarkingFormStore(
    (state) => state.resetMarkingFormStore,
  );

  const { handleOpen: onOpenSnackbar, onClose: onCloseSnackbar } = useSnackBar(
    () => (
      <MapSnackbar onClose={onCloseSnackbar}>
        <p>{MarkingModalText.tempSaveSnackbar1}</p>
        <p>{MarkingModalText.tempSaveSnackbar2}</p>
      </MapSnackbar>
    ),
  );

  const { mutate: postTempMarkingData } = usePostTempMarkingForm();

  const handleSave = () => {
    const { token } = useAuthStore.getState();

    if (!token) {
      throw new Error(MarkingModalError.unAuthorized);
    }

    const formObj = useMarkingFormStore.getState();
    postTempMarkingData(
      { token, ...center, ...formObj },
      {
        onSuccess: () => {
          onCloseMarkingModal();
          resetMarkingFormStore();
          setMode("view");
          onOpenSnackbar();
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      },
    );
  };

  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      onClick={handleSave}
    >
      {MarkingModalText.tempSaveButton}
    </Button>
  );
};

export const MarkingFormModal = ({
  onCloseMarkingModal,
}: MarkingFormModalProps) => {
  return (
    <Modal modalType="center">
      <MarkingModalNav onCloseMarkingModal={onCloseMarkingModal} />
      <section className="flex flex-col gap-8">
        {/* 사용자 현재 위치 */}
        <CurrentLocation onCloseMarkingModal={onCloseMarkingModal} />
        {/* 보기 권한 설정 */}
        <PostVisibilitySelect />
        {/* 사진 추가하기 */}
        <PhotoInput />
        {/* 메모하기 */}
        <MarkingTextArea />
        {/* 제출 버튼들 */}
        <div className="flex flex-col gap-2">
          <SaveButton onCloseMarkingModal={onCloseMarkingModal} />
          <TemporarySaveButton onCloseMarkingModal={onCloseMarkingModal} />
        </div>
      </section>
    </Modal>
  );
};