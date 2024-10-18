import { PetInformationForm } from "@/features/auth/ui";
import { UserInfo } from "@/entities/profile/api";
import { MASCOT_IMAGE_URL } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { usePutChangePetInformation } from "../api";

export const useChangePetInfoModal = (pet: NonNullable<UserInfo["pet"]>) => {
  const { mutate: putChangePetInformation, isPending } =
    usePutChangePetInformation();

  const isProfileChanged = (profile: File | null) =>
    pet.profile && profile === null;

  const { handleOpen, onClose } = useModal(() => (
    <Modal modalType="fullPage">
      <Modal.Header
        onClick={() => {
          if (isPending) return;
          onClose();
        }}
      />
      <Modal.Content>
        <h1 className="headline-3 overflow-ellipsis text-center text-grey-900">
          우리 댕댕이를 소개해 주세요
        </h1>
        <PetInformationForm
          disabled={isPending}
          initialState={{
            ...pet,
            profile: {
              name: "",
              url: pet.profile || MASCOT_IMAGE_URL,
              file: null,
            },
          }}
          onSubmit={({ profile, ...rest }) => {
            // 수정에 사용하는 formObj 에서 prevProfile은 새로운 파일이 존재 할 경우엔 null 값을
            // 넣어주고, 기존의 프로필 이미지를 사용할 경우엔 기존의 프로필 이미지를 넣어줍니다.
            putChangePetInformation(
              {
                profile,
                ...rest,
                prevProfile: isProfileChanged(profile) ? null : pet.profile,
              },
              {
                onSuccess: onClose,
              },
            );
          }}
        />
      </Modal.Content>
    </Modal>
  ));

  return handleOpen;
};
