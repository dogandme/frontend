import { Button } from "@/shared/ui/button";

interface FollowingButtonProps {
  onClick: () => void;
  type?: "default" | "mini";
}
export const FollowingButton = ({
  type = "default",
  onClick,
}: FollowingButtonProps) => {
  if (type === "default") {
    return (
      <Button
        size="small"
        variant="filled"
        colorType="primary"
        fullWidth={false}
        onClick={() => {
          onClick();
        }}
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
    >
      팔로우
    </button>
  );
};
