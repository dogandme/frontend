import { ReactNode } from "react";

interface ContentListProps {
  children: ReactNode;
}

const ContentList = ({ children }: ContentListProps) => {
  return <ul className="flex flex-col gap-8">{children}</ul>;
};

export default ContentList;
