import { PetInformationForm } from "@/features/auth/ui";
import { UserInfo } from "@/entities/profile/api";
import { useModal } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { usePutChangePetInformation } from "../api";

export const useChangePetInfoModal = (pet: NonNullable<UserInfo["pet"]>) => {
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
              url: pet.profile,
              file: null,
            },
          }}
          onSubmit={({ profile, name, breed, personalities, description }) => {
            /**
             * 새로운 File 이 추가되지 않았거나
             * initialState 로 건내준 pet 정보와 변경 된 정보가 변경되지 않았다면
             * isChaProfile 을 false 로 설정합니다.
             */
            putChangePetInformation({
              name,
              breed,
              personalities,
              description,
              isChaProfile: !!profile.file || profile.url !== pet.profile,
              image: profile.file,
            });
          }}
        />
      </Modal.Content>
    </Modal>
  ));

  const { mutate: putChangePetInformation, isPending } =
    usePutChangePetInformation();

  return handleOpen;
};
