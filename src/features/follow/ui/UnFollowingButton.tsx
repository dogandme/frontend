import { Button } from "@/shared/ui/button";

interface UnFollowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}
export const UnFollowingButton = ({
  onClick,
  ...props
}: UnFollowingButtonProps) => {
  return (
    <Button
      size="small"
      variant="outlined"
      colorType="tertiary"
      fullWidth={false}
      onClick={() => {
        onClick();
      }}
      {...props}
    >
      팔로잉
    </Button>
  );
};
