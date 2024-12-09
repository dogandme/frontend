import React from "react";
import { Link } from "react-router-dom";

interface ProfileLinkProps {
  nickname: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileLink = ({
  nickname,
  children,
  className = "",
}: ProfileLinkProps) => {
  return (
    <Link to={`/@${nickname}`} className={className}>
      {children}
    </Link>
  );
};
