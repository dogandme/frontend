import React from "react";
import { Link } from "react-router-dom";
import { Nickname } from "@/entities/profile/api";

interface ProfileLinkProps {
  nickname: Nickname;
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
