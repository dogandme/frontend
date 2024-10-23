import { Button } from "@/shared/ui/button";
import { DropDownIcon } from "@/shared/ui/icon";

export const MarkingFilter = ({ children }: { children: string }) => {
  return (
    <Button
      variant="text"
      colorType="tertiary"
      size="xSmall"
      fullWidth={false}
      className="pr-0"
    >
      {children}
      <DropDownIcon />
    </Button>
  );
};
