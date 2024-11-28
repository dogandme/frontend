import {
  FollowerUserItem,
  FollowItemContainer,
  FollowItemContainerSkeleton,
  FollowNavigationBar,
} from "@/widgets/follow";
import { FollowingUserItem } from "@/widgets/follow";
import { useGetFollowerList } from "@/entities/follow/api";
import { useGetMyProfile } from "@/entities/profile/api";
import { useInfiniteScroll, useNicknameParams, withAuth } from "@/shared/lib";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

/**
 * 팔로워 페이지의 경우 나의 페이지일 경우엔 팔로워 리스트를 보여주고
 * 남의 페이지의 경우엔 남의 팔로워를 보여주나 , 나와의 팔로잉 상태를 보여줘야 합니다.
 */
export const FollowerPage = withAuth(() => {
  const { nicknameParams, isMyPage } = useNicknameParams();
  const { data: myProfile } = useGetMyProfile();
  const {
    data: followerList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetFollowerList({
    nickname: nicknameParams,
  });
  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (!followerList || !myProfile) {
    return (
      <section>
        <BackwardNavigationBar
          label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
        />
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
        {followerList.map(({ userId, nickname, pet }) =>
          isMyPage ? (
            <FollowerUserItem
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isFollowing={myProfile.myFollowingIdsMap[userId]}
            />
          ) : (
            <FollowingUserItem
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isFollowing={myProfile.myFollowingIdsMap[userId]}
            />
          ),
        )}
        <div ref={setNode} />
      </FollowItemContainer>
    </section>
  );
}, ["ROLE_GUEST", "ROLE_USER"]);
