import { Button } from "@/shared/ui/button";

interface AddFollowButtonProps {
  onClick: () => void;
  type?: "default" | "mini";
}
export const AddFollowButton = ({
  type = "default",
  onClick,
}: AddFollowButtonProps) => {
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
