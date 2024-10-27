import { useChangePetInfoModal } from "@/features/setting/hooks/useChangePetInfoModal";
import { PetInfo } from "@/entities/profile/api";
import { EditIcon } from "@/shared/ui/icon";

export const ProfileEditButton = ({ pet }: { pet: PetInfo }) => {
  const handleOpen = useChangePetInfoModal(pet);

  return (
    <button
      className="w-6 h-6"
      aria-label="프로필 설정 수정 하기 버튼"
      onClick={handleOpen}
    >
      <EditIcon />
    </button>
  );
};
