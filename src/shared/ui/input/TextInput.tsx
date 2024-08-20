import BaseInput from "./BaseInput";
import type { InputProps } from "./input.types";
/**
 * PlainTextInput 의 경우에는 경우에 따른 에러 핸들링이 필요하기 때문에 외부로부터 condition과
 * condition에 따른 supportingText를 주입받습니다.
 * @figma Input fields/TextField 디자인 시스템 참고
 */
const TextInput = ({
  title,
  id,
  value,
  onChange,
  condition,
  supportingText,
  ...props
}: InputProps<"textInput">) => {
  const { designType = "textInput", ...rest } = props;
  return (
    <BaseInput
      title={title}
      id={id}
      value={value}
      onChange={onChange}
      condition={condition}
      designType={designType}
      isSupportingNeeded
      supportingText={supportingText}
      {...rest}
    />
  );
};

export default TextInput;
