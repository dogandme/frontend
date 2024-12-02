import {
  FollowItemContainer,
  FollowItemContainerSkeleton,
  FollowNavigationBar,
} from "@/widgets/follow";
import { FollowingUserItem } from "@/widgets/follow/followingUserItem";
import { useGetFollowingList } from "@/entities/follow/api";
import { useGetMyProfile } from "@/entities/profile/api";
import { useInfiniteScroll, useNicknameParams, withAuth } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

export const FollowingPage = withAuth(() => {
  const { nicknameParams } = useNicknameParams();

  const { data: myProfile } = useGetMyProfile();
  const {
    data: followingList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetFollowingList({
    nickname: nicknameParams,
  });

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (!followingList || !myProfile) {
    return (
      <section>
        <BackwardNavigationBar>{nicknameParams}</BackwardNavigationBar>
        <FollowNavigationBar nickname={nicknameParams} />
        <FollowItemContainerSkeleton />
      </section>
    );
  }

  return (
    <section>
      <BackwardNavigationBar>{nicknameParams}</BackwardNavigationBar>
      <FollowNavigationBar nickname={nicknameParams} />
      <FollowItemContainer>
        {followingList.map(({ userId, nickname, pet }) => (
          <FollowingUserItem
            key={userId}
            nickname={nickname}
            petName={pet.name}
            profile={pet.profile}
            isFollowing={myProfile.myFollowingIdsMap[userId]}
          />
        ))}
      </FollowItemContainer>
      <div ref={setNode} />
    </section>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);
