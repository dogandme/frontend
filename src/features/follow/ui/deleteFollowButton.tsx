import { Button } from "@/shared/ui/button";

interface DeleteFollowButtonProps {
  onClick: () => void;
}
export const DeleteFollowButton = ({ onClick }: DeleteFollowButtonProps) => {
  return (
    <Button
      size="small"
      variant="outlined"
      colorType="tertiary"
      fullWidth={false}
      onClick={() => {
        onClick();
      }}
    >
      팔로잉
    </Button>
  );
};
