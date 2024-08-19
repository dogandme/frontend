import BaseInput from "./BaseInput";
import type { InputProps } from "./BaseInput";

/**
 * searchTextInput 의 경우에는 에러에 대한 핸들링 처리가 필요없기 때문에 단순히 label,input 을 연결 할 id와
 * label 의 title, input 의 value, onChange 를 받아서 BaseInput 컴포넌트에 전달해주는 역할을 합니다.
 * @figma Input fields/Search의 디자인 시스템 참고
 */
const SearchTextInput = ({
  title,
  id,
  value,
  onChange,
  ...props
}: InputProps) => {
  const {
    componentType = "searchTextInput",
    condition = "default",
    ...rest
  } = props;
  return (
    <BaseInput
      title={title}
      id={id}
      value={value}
      onChange={onChange}
      componentType={componentType}
      condition={condition}
      isSupportingNeeded={false}
      leadingIcon={
        <svg
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.76 13.27L20.49 19L19 20.49L13.27 14.76C12.2 15.53 10.91 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3C13.09 3 16 5.91 16 9.5C16 10.91 15.53 12.2 14.76 13.27ZM9.5 5C7.01 5 5 7.01 5 9.5C5 11.99 7.01 14 9.5 14C11.99 14 14 11.99 14 9.5C14 7.01 11.99 5 9.5 5Z"
            fill="#9E9E9E"
          />
        </svg>
      }
      {...rest}
    />
  );
};

export default SearchTextInput;
