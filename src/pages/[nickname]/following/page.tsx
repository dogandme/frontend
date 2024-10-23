import { FollowNavigationBar } from "@/widgets/follow";
import { FollowingUserList } from "@/widgets/follow/followingUserList";
import { useGetFollowingList } from "@/entities/follow/api";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const FollowingPage = () => {
  const { nicknameParams } = useNicknameParams();

  const { data, fetchNextPage } = useGetFollowingList({
    nickname: nicknameParams,
  });

  return (
    <section>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
      />
      <FollowNavigationBar nickname={nicknameParams} />
      {/* TODO 무한스크롤로 변경 하기 */}
      <ul className="px-4 flex flex-col gap-4 overflow-y-auto">
        <button onClick={() => fetchNextPage()}>next fetch</button>
        {data?.map((content) => (
          <FollowingUserList
            key={content.userId}
            nickname={content.nickname}
            petName={content.pet.name}
            profile={content.pet.profile}
            isMutualFollow={Math.random() > 0.5}
          />
        ))}
      </ul>
    </section>
  );
};
