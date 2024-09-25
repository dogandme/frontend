import { Input } from "@/shared/ui/input";
import { FormModal } from "@/shared/ui/modal/FormModal";

interface ChangeNickNameModalProps {
  onClose: () => Promise<void>;
}

export const ChangeNickNameModal = ({ onClose }: ChangeNickNameModalProps) => {
  return (
    <FormModal onClose={onClose} title="닉네임 변경">
      <Input
        id="change-nickname"
        componentType="outlinedText"
        placeholder="닉네임을 입력해주세요"
        label="닉네임"
        trailingNode={<span className="text-grey-500">0 / 20</span>}
        maxLength={20}
        essential
      />
    </FormModal>
  );
};
