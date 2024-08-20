import designSystem from "./input.styles";
import type { InputProps } from "./input.types";

const TextField = ({
  title,
  id,
  condition,
  supportingText,
  additionalOutterStyle,
}: InputProps<"textField">) => {
  const { base, enabled, hover, focus, focusHover, supportingTextColor } =
    designSystem["textField"][condition];

  return (
    <div className="flex flex-col items-start">
      <label htmlFor={id} className="title-3 flex items-start gap-1 pb-2">
        {title}
      </label>
      <div
        className={`${base} ${enabled} ${hover} ${focus} ${focusHover}`}
        style={additionalOutterStyle}
      >
        <textarea
          name={id}
          id={id}
          className="body-2 h-[4.875rem] resize-none self-stretch whitespace-normal text-grey-700 placeholder-grey-500 focus:outline-none disabled:text-grey-300"
          maxLength={150}
          style={{
            backgroundColor: "transparent",
          }}
        ></textarea>
        <p className="flex items-end justify-end gap-[2px] self-stretch"></p>
      </div>
      <p className={`body-3 flex flex-1 ${supportingTextColor}`}>
        {supportingText}
      </p>
    </div>
  );
};

export default TextField;
