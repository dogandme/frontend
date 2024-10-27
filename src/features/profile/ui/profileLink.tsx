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
    <Link
      to={`/@${nickname}`}
      onClick={(event) => {
        // 이벤트가 버튼에서 발생한 경우 네비게이션을 중지합니다.
        if (event.target instanceof HTMLButtonElement) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
};
