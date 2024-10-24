import { FollowList, FollowNavigationBar } from "@/widgets/follow";
import { FollowingUserItem } from "@/widgets/follow/followingUserItem";
import { useGetFollowingList } from "@/entities/follow/api";
import { useGetMyFollowingIdsMap } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const FollowingPage = () => {
  const { nicknameParams } = useNicknameParams();

  const { data: myFollowingIdsMap } = useGetMyFollowingIdsMap();
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

  if (!myFollowingIdsMap) {
    return <div>loading...</div>;
  }

  return (
    <section>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
      />
      <FollowNavigationBar nickname={nicknameParams} />
      <FollowList>
        {followingList?.map(({ userId, nickname, pet }) => (
          <FollowingUserItem
            key={userId}
            nickname={nickname}
            petName={pet.name}
            profile={pet.profile}
            isFollowing={myFollowingIdsMap[userId]}
          />
        ))}
      </FollowList>
      <div ref={setNode} />
    </section>
  );
};
