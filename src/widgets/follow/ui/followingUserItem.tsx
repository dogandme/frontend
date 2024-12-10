/**
 * 해당 컴포넌트는 다음과 같은 경우 사용 됩니다.
 * 1. 나의 프로필에서 팔로잉 리스트를 확인 할 때
 * 2. 남의 프로필의 팔로잉 리스트를 확인 할 때
 * 3. 남의 프로필의 팔로워 리스트를 확인 할 때
 */
import { FollowingToggle } from "@/features/follow/ui";
import { ProfileLink } from "@/features/profile/ui";
import { EmptyProfileImage, ProfileImage } from "@/entities/profile/ui";
import { useNicknameParams } from "@/shared/lib";
import type { FollowItemProps } from "../type/client";

type FollowingUserItemProps = FollowItemProps & { isFollowing: boolean };

export const FollowingUserItem = ({
  nickname,
  petName,
  profile,
  isFollowing,
}: FollowingUserItemProps) => {
  const { isMyPage } = useNicknameParams();

  return (
    <ProfileLink
      nickname={nickname}
      className="px-4 flex gap-4 overflow-y-auto"
    >
      {profile ? (
        <ProfileImage
          imageUrl={profile}
          nickname={nickname}
          size="large"
          className=" rounded-[1.75rem]"
        />
      ) : (
        <EmptyProfileImage size="large" className=" rounded-[1.75rem]" />
      )}
      <div className="flex flex-col justify-center flex-1">
        <p className="title-2 text-grey-700">{nickname}</p>
        <p className="body-3 text-grey-500">{petName}</p>
      </div>
      {!isMyPage || (
        <FollowingToggle
          nickname={nickname}
          isFollowing={isFollowing}
          size="small"
        />
      )}
    </ProfileLink>
  );
};
