import { PetInformationForm } from "@/features/auth/ui";
import { UserInfo } from "@/entities/profile/api";
import { MASCOT_IMAGE_URL } from "@/shared/constants";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";

export const useChangePetInfoModal = (pet: NonNullable<UserInfo["pet"]>) => {
  const { handleOpen, onClose } = useModal(() => (
    <Modal modalType="fullPage">
      <Modal.Header onClick={onClose} />
      <Modal.Content>
        <h1 className="headline-3 overflow-ellipsis text-center text-grey-900">
          우리 댕댕이를 소개해 주세요
        </h1>
        <PetInformationForm
          initialState={{
            ...pet,
            profile: {
              name: "",
              url: pet.profile || MASCOT_IMAGE_URL,
              file: null,
            },
          }}
          onSubmit={() => {}}
        />
      </Modal.Content>
    </Modal>
  ));

  return handleOpen;
};
