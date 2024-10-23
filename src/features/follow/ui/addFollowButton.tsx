import { Button } from "@/shared/ui/button";

interface AddFollowButtonProps {
  type?: "default" | "mini";
}
export const AddFollowButton = ({ type = "default" }: AddFollowButtonProps) => {
  if (type === "default") {
    return (
      <Button
        size="small"
        variant="filled"
        colorType="primary"
        fullWidth={false}
      >
        팔로우
      </Button>
    );
  }
  return <button className="btn-3 text-tangerine-500">팔로우</button>;
};
