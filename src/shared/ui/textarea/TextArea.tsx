import { useState } from "react";
import { Badge } from "../badge";
import { textAreaStyles, baseStyles } from "./TextArea.styles";

// 현재 디자인 시스템상에서 TextArea 컴포넌트에선 statusText가 존재하지 않습니다.
// 만약 statusText 를 추가할 일이 생긴다면 해당 디자인 시스템에 맞게 추가해주세요.

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  statusText?: string;
  isError?: boolean;
  maxLength?: number;
  disabled?: boolean;
  essential?: boolean;
  fullWidth?: boolean;
}

export const TextArea = ({
  id,
  label,
  statusText,
  isError = false,
  maxLength = 150,
  disabled = false,
  essential = false,
  fullWidth = true,
  ...props
}: TextAreaProps) => {
  const [currentLength, setCurrentLength] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const shouldShowStatusText = statusText !== undefined;

  const { onInput, onFocus, onBlur, ...rest } = props;

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (onInput) {
      onInput(event);
    }
    setCurrentLength(event.currentTarget.value.length);
  };
  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onFocus) {
      onFocus(event);
    }

    if (shouldShowStatusText) {
      setIsFocus(true);
    }
  };
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onBlur) {
      onBlur(event);
    }
    if (shouldShowStatusText) {
      setIsFocus(false);
    }
  };

  const status = isError ? "error" : "default";
  const {
    statusTextClass,
    disabled: disableClass,
    enabled: enabledClass,
    ...restStyleObject
  } = textAreaStyles[status];

  const resetClasses = Object.values(restStyleObject).join(" ");

  return (
    <div className={`flex ${fullWidth && "w-full"} flex-col items-start`}>
      {label && (
        <div className="flex gap-1 pb-2">
          <label htmlFor={id} className="title-3 text-grey-700">
            {label}
          </label>
          {essential && <Badge colorType="primary" />}
        </div>
      )}
      <div
        className={`${resetClasses} ${disabled ? disableClass : enabledClass}`}
      >
        <textarea
          name={id}
          id={id}
          className={baseStyles.textArea}
          autoComplete="off"
          maxLength={maxLength}
          disabled={disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <p className="body-3 flex items-end justify-end gap-[2px] self-stretch">
          {`${currentLength} / ${maxLength}`}
        </p>
      </div>
      {shouldShowStatusText && (
        <p
          className={`${statusTextClass} ${baseStyles.statusText}`}
          role="status"
        >
          {isError ? statusText : isFocus ? statusText : ""}
        </p>
      )}
    </div>
  );
};
