import { ArrowDropDownIcon } from "@/shared/ui/icon";
import { Input, InputProps } from "@/shared/ui/input/Input";

type FixedInputProps = "type" | "componentType" | "readOnly" | "trailingNode";

export const SelectOpener = ({
  ...props
}: Omit<InputProps, FixedInputProps>) => {
  return (
    <Input
      type="text"
      trailingNode={<ArrowDropDownIcon />}
      componentType="outlinedText"
      readOnly
      style={{ cursor: "pointer" }}
      {...props}
    />
  );
};
