import { FollowNavigationBar } from "@/widgets/follow";
import { FollowingUserList } from "@/widgets/follow/followingUserList";
import { useGetFollowingList } from "@/entities/follow/api";
import { useGetMyMutualFollowMap } from "@/entities/profile/api";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const FollowingPage = () => {
  const { nicknameParams } = useNicknameParams();

  const [mutualFollowMap] = useGetMyMutualFollowMap();
  const { data, fetchNextPage } = useGetFollowingList({
    nickname: nicknameParams,
  });

  if (!mutualFollowMap) {
    return <div>loading...</div>;
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
        {data?.map(({ userId, nickname, pet }) => (
          <FollowingUserList
            key={userId}
            nickname={nickname}
            petName={pet.name}
            profile={pet.profile}
            isMutualFollow={mutualFollowMap[userId]}
          />
        ))}
      </ul>
    </section>
  );
};
