import { FollowNavigationBar } from "@/widgets/follow";
import { useNicknameParams } from "@/shared/lib/profile";
import { BackwardNavigationBar } from "@/shared/ui/navigationbar";

export const FollowerPage = () => {
  const { nicknameParams } = useNicknameParams();
  return (
    <section>
      <BackwardNavigationBar
        label={<h1 className="title-1 text-grey-900">{nicknameParams}</h1>}
      />
      <section className="px-4">
        <FollowNavigationBar nickname={nicknameParams} />
      </section>
    </section>
  );
};
