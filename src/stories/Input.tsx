import { useState } from "react";

const Input = () => {
  const [value, setValue] = useState<string>("");
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
