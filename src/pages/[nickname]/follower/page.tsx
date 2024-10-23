import { FollowerUserList, FollowNavigationBar } from "@/widgets/follow";
import { FollowingUserList } from "@/widgets/follow/followingUserList";
import { useGetFollowerList } from "@/entities/follow/api";
import { useGetMyMutualFollowMap } from "@/entities/profile/api";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

/**
 * 팔로워 페이지의 경우 나의 페이지일 경우엔 팔로워 리스트를 보여주고
 * 남의 페이지의 경우엔 남의 팔로워를 보여주나 , 나와의 팔로잉 상태를 보여줘야 합니다.
 */
export const FollowerPage = () => {
  const { nicknameParams, isMyPage } = useNicknameParams();
  const [mutualFollowMap] = useGetMyMutualFollowMap();

  const { data, fetchNextPage } = useGetFollowerList({
    nickname: nicknameParams,
  });

  // TODO 로딩 상태 생각해보기
  if (!mutualFollowMap) {
    return <div>내 정보를 가져오는 중...</div>;
  }

  return (
    <section>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
      />
      <FollowNavigationBar nickname={nicknameParams} />
      {/* TODO 무한스크롤로 변경 하기 */}
      <ul className="px-4 flex flex-col gap-4 overflow-y-auto">
        <button onClick={() => fetchNextPage()}>next fetch</button>
        {data?.map(({ userId, nickname, pet }) =>
          isMyPage ? (
            <FollowerUserList
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isMutualFollow={mutualFollowMap[userId]}
            />
          ) : (
            <FollowingUserList
              key={userId}
              nickname={nickname}
              petName={pet.name}
              profile={pet.profile}
              isMutualFollow={mutualFollowMap[userId]}
            />
          ),
        )}
      </ul>
    </section>
  );
};
