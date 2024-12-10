import { Button } from "@/shared/ui/button";

// TODO 다음 리팩토링 때 해당 컴포넌트 제거 하기
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
