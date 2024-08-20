import designSystem from "./input.styles";
import type { DesignConditionMap, InputProps } from "./input.types";

/**
 * 해당 컴포넌트는 shared/ui 밖으로 export 되지 않으며 내부에서 다양한 디자인 시스템의 input 컴포넌트를 생성하기 위해 사용됩니다.
 * 가장 높은 추상화 수준을 가지고 있으며, 실제로 사용되는 컴포넌트는 TextInput, TimerTextInput, OutLinedTextInput 등이 있습니다.
 */
const BaseInput = <T extends keyof DesignConditionMap>({
  // 디자인 시스템을 위한 props
  // designType : 디자인 시스템의 종류를 나타내는 문자열 (textInput | timerTextInput | outLinedTextInput)
  // condition : 디자인 시스템의 상태를 나타내는 문자열 (default | error)
  designType,
  condition,
  // input 요소를 위한 props
  title,
  id,
  // input 요소 외의 요소를 위한 props
  // leadingIcon : input 요소 앞에 위치하는 아이콘
  // countArea : input 요소 오른쪽에 위치하는 카운트 영역
  // trailingIcon : input 요소 뒤에 위치하는 아이콘
  leadingIcon,
  countArea,
  trailingIcon,
  // supportingText : input 요소 하단에 위치하는 보조 텍스트
  supportingText,
  // additionalOutterStyle : input 요소 외부에 추가적으로 적용할 스타일 , 동적으로 변화가 필요한 경우 사용 (optional)
  // additionalSupportingTextStyle : supportingText에 추가적으로 적용할 스타일 , 동적으로 변화가 필요한 경우 사용 (optional)
  additionalOutterStyle,
  additionalSupportingTextStyle,
  // input 태그에 대한 기본 props
  // 외부에서 동적으로 input 태그를 조작 할 수 있도록 하기 위함
  ...props
}: InputProps<T>) => {
  // designSystem 객체에서 designType과 condition에 해당하는 스타일 가져오기
  const {
    base,
    enabled,
    hover,
    focus,
    focusHover,
    disabled,
    supportingTextColor,
  } = designSystem[designType][condition];

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 pb-2">
        <label htmlFor={id} className="title-3">
          {title}
        </label>
      </div>
      <div
        className={`${base} ${enabled} ${hover} ${focus} ${focusHover} ${disabled}`}
        style={additionalOutterStyle}
      >
        {leadingIcon}
        <input
          id={id}
          name={id}
          className="disable:placeholder-grey-300 h-[1.375rem] flex-1 overflow-hidden text-ellipsis whitespace-nowrap placeholder-grey-500 focus:outline-none"
          style={{
            backgroundColor: "transparent",
          }}
          autoComplete="off"
          {...props}
        />
        {countArea}
        {trailingIcon}
      </div>
      {supportingText !== undefined && (
        <p
          className={`${supportingTextColor} body-3 flex gap-[0.625rem] self-stretch px-3 pb-3 pt-1`}
          style={additionalSupportingTextStyle}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
};

export default BaseInput;
