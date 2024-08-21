import { useState } from "react";
import { textAreaStyles, baseStyles } from "./TextArea.styles";

// 현재 디자인 시스템상에서 TextArea 컴포넌트에선 statusText가 존재하지 않습니다.
// 만약 statusText 를 추가할 일이 생긴다면 해당 디자인 시스템에 맞게 추가해주세요.

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  isError: boolean;
  maxLength: number;
}

const TextArea = ({
  id,
  label,
  isError,
  maxLength = 150,
  ...props
}: TextAreaProps) => {
  const [value, setValue] = useState<string>("");
  const status = isError ? "error" : "default";
  const wrapperClasses = textAreaStyles[status];

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // virtual DOM 상의 value.length 는 항상 Actual DOM 상의 value.length 보다 1 작습니다.
    // 그러므로 value.length - 1 을 해줘야 합니다.
    const currentLength = e.target.value.length;
    if (currentLength - 1 >= maxLength) {
      return;
    }
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-col items-start">
      <label htmlFor={id} className="title-3 flex items-start gap-1 pb-2">
        {label}
      </label>
      <div className={`${Object.values(wrapperClasses).join(" ")}`}>
        <textarea
          name={id}
          id={id}
          className={baseStyles.textArea}
          value={value}
          onChange={handleOnChange}
          maxLength={maxLength}
          {...props}
        />
        <p className="flex items-end justify-end gap-[2px] self-stretch">
          {`${value.length}/${maxLength}`}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
