import designSystem from "./input.styles";
import type { DesignConditionMap, InputProps } from "./input.types";

const BaseInput = <T extends keyof DesignConditionMap>({
  title,
  id,
  leadingIcon,
  countArea,
  trailingIcon,
  isSupportingNeeded = true,
  supportingText,
  designType,
  condition,
  additionalOutterStyle,
  additionalSupportingTextStyle,
  ...props
}: InputProps<T>) => {
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
      {isSupportingNeeded && (
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
