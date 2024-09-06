import { HTMLAttributes } from "react";
import List from "../list/List";

const OptionList = ({
  children,
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  return <List {...props}>{children}</List>;
};

export default OptionList;
