import { Button } from "@/shared/ui/button";

interface FollowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  buttonType?: "default" | "mini";
}
export const FollowingButton = ({
  buttonType = "default",
  onClick,
  ...props
}: FollowingButtonProps) => {
  if (buttonType === "default") {
    return (
      <Button
        size="small"
        variant="filled"
        colorType="primary"
        fullWidth={false}
        onClick={() => {
          onClick();
        }}
        {...props}
      >
        팔로우
      </Button>
    );
  }
  return (
    <button
      className="btn-3 text-tangerine-500"
      onClick={() => {
        onClick();
      }}
      {...props}
    >
      팔로우
    </button>
  );
};
