import { Button } from "@/shared/ui/button";

export const DeleteFollowerButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Button
      size="small"
      variant="outlined"
      colorType="tertiary"
      fullWidth={false}
      {...props}
    >
      삭제
    </Button>
  );
};
