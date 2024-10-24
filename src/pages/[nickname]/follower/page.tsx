import {
  FollowerUserItem,
  FollowList,
  FollowNavigationBar,
} from "@/widgets/follow";
import { FollowingUserItem } from "@/widgets/follow";
import { useGetFollowerList } from "@/entities/follow/api";
import { useGetMyFollowingIdsMap } from "@/entities/profile/api";
import { useInfiniteScroll } from "@/shared/lib";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

/**
 * 팔로워 페이지의 경우 나의 페이지일 경우엔 팔로워 리스트를 보여주고
 * 남의 페이지의 경우엔 남의 팔로워를 보여주나 , 나와의 팔로잉 상태를 보여줘야 합니다.
 */
export const FollowerPage = () => {
  const { nicknameParams, isMyPage } = useNicknameParams();
  const { data: myFollowingIdsMap } = useGetMyFollowingIdsMap();
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

  // TODO 로딩 상태 생각해보기
  if (!myFollowingIdsMap) {
    return <div>내 정보를 가져오는 중...</div>;
  }

  return (
    <section>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
      />
      <FollowNavigationBar nickname={nicknameParams} />
      <FollowList>
        {followerList?.map(({ userId, nickname, pet }) =>
          isMyPage ? (
            <FollowerUserItem
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isFollowing={myFollowingIdsMap[userId]}
            />
          ) : (
            <FollowingUserItem
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isFollowing={myFollowingIdsMap[userId]}
            />
          ),
        )}
        <div ref={setNode} />
      </FollowList>
    </section>
  );
};
