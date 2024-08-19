import BaseInput from "./BaseInput";
import type { InputProps } from "./BaseInput";

/**
 * TimerTextInput 의 경우에는 경우에 따른 에러 핸들링이 필요하기 때문에 외부로부터 condition과
 * condition에 따른 supportingText를 주입받습니다.
 * @figma Input fields/Timer 디자인 시스템 참고
 */

const TimerTextInput = ({
  title,
  id,
  value,
  onChange,
  condition,
  supportingText,
  trailingIcon,
  ...props
}: InputProps) => {
  const { componentType = "timerTextInput", ...rest } = props;
  return (
    <BaseInput
      title={title}
      id={id}
      value={value}
      onChange={onChange}
      condition={condition}
      componentType={componentType}
      isSupportingNeeded
      supportingText={supportingText}
      trailingIcon={trailingIcon}
      {...rest}
    />
  );
};

export default TimerTextInput;
