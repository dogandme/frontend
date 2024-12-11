import React from "react";
import { Link } from "react-router-dom";
import type { ProfileInfo } from "@/entities/profile/types/server";

interface ProfileLinkProps extends Pick<ProfileInfo, "nickname"> {
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
