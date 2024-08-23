import { useState, useEffect, useRef } from "react";
import { textAreaStyles, baseStyles } from "./TextArea.styles";

// 현재 디자인 시스템상에서 TextArea 컴포넌트에선 statusText가 존재하지 않습니다.
// 만약 statusText 를 추가할 일이 생긴다면 해당 디자인 시스템에 맞게 추가해주세요.

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  isError?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

const TextArea = ({
  id,
  label,
  isError = false,
  maxLength = 150,
  disabled = false,
  ...props
}: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [currentLength, setCurrentLength] = useState<number>(0);

  // textarea의 최대 글자수를 제한하고 현재 글자수를 표시하기 위한 Effect
  // 직접 actual dom에 접근하여 addEventListener를 사용하는 이유는 컴포넌트 상위에서 props로
  // 이벤트 핸들러를 등록해주는 경우가 존재 할 수 있기 때문입니다.
  // addEventListener로 이벤트 핸들러를 부착해두게 되면 상단에서 등록한 이벤트 핸들러와 충돌이 발생하지 않습니다.
  useEffect(() => {
    const $textArea = textAreaRef.current;
    if (!$textArea) {
      return;
    }

    // removeEventListener를 위한 이벤트 핸들러 함수로 기명 함수를 사용하여 removeEventListener를 사용할 수 있도록 합니다.
    const handleInput = (e: Event) => {
      const { value } = e.target as HTMLTextAreaElement;
      setCurrentLength(value.length);
    };

    $textArea.addEventListener("input", handleInput);

    return () => {
      $textArea.removeEventListener("input", handleInput);
    };
  }, [maxLength]);

  const status = isError ? "error" : "default";
  const {
    disabled: disableClass,
    enabled: enabledClass,
    ...restStyleObject
  } = textAreaStyles[status];

  const resetClasses = Object.values(restStyleObject).join(" ");

  return (
    <div className="flex flex-col items-start">
      <label htmlFor={id} className="title-3 flex items-start gap-1 pb-2">
        {label}
      </label>
      <div
        className={`${resetClasses} ${disabled ? disableClass : enabledClass}`}
      >
        <textarea
          name={id}
          id={id}
          className={baseStyles.textArea}
          maxLength={maxLength}
          ref={textAreaRef}
          disabled={disabled}
          aria-label={label}
          {...props}
        />
        <p className="body-3 flex items-end justify-end gap-[2px] self-stretch">
          {`${currentLength} / ${maxLength}`}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
