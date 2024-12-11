import { useChangePetInfoModal } from "@/features/setting/hooks/useChangePetInfoModal";
import { PetInfo } from "@/entities/profile/type/server";
import { EditIcon } from "@/shared/ui/icon";

interface ProfileEditButtonProps {
  pet: PetInfo;
}

export const ProfileEditButton = ({ pet }: ProfileEditButtonProps) => {
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
