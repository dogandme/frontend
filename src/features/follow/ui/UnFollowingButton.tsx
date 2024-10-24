import { Button } from "@/shared/ui/button";

interface UnFollowingButtonProps {
  onClick: () => void;
}
export const UnFollowingButton = ({ onClick }: UnFollowingButtonProps) => {
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
