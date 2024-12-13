import {
  FollowingUserItem,
  FollowItemContainer,
  FollowItemContainerSkeleton,
  FollowNavigationBar,
} from "@/widgets/follow/ui";
import { useGetFollowingList } from "@/entities/follow/api";
import { useGetMyProfile } from "@/entities/profile/api";
import { useInfiniteScroll, useNicknameParams, withAuth } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";
import { LoadingSpinner } from "@/shared/ui/spinner";

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
            name={pet.name}
            profile={pet.profile}
            isFollowing={myProfile.myFollowingIdsMap[userId]}
          />
        ))}
      </FollowItemContainer>
      {isFetchingNextPage && <LoadingSpinner />}
      <div ref={setNode} />
    </section>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);
