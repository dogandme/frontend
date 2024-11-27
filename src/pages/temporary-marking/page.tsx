import { useNavigate } from "react-router-dom";
import { TemporaryMarkingItem } from "@/widgets/marking/ui";
import { useGetTemporaryMarkingList } from "@/entities/marking/api";
import { useInfiniteScroll, withAuth } from "@/shared/lib";
import { useAuthStore } from "@/shared/store";
import { BackwardNavigationBar } from "@/shared/ui/navigationBar";

export const TemporaryMarkingPage = withAuth(() => {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetTemporaryMarkingList();

  const [setNode] = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // TODO 권한 없는 회원에게 보여줄 페이지 구현 하기
  if (role !== "ROLE_USER") {
    return;
  }

  if (!data) {
    return <div>loading ...</div>;
  }

  if (data.length === 0) {
    return <div>임시저장된 마킹이 없습니다</div>;
  }

  return (
    <>
      <BackwardNavigationBar onClick={() => navigate(`/@${nickname}`)}>
        임시저장
      </BackwardNavigationBar>
      <section className="pt-4 px-4 pb-32 flex flex-col gap-8">
        {data.map(([date, temporaryMarkingList]) => (
          <div className="flex flex-col gap-8">
            <p className="text-grey-700 title-2">{date}</p>
            <ul className="flex flex-col gap-8">
              {temporaryMarkingList.map((marking) => (
                <TemporaryMarkingItem key={marking.markingId} {...marking} />
              ))}
            </ul>
          </div>
        ))}
        <div ref={setNode} />
      </section>
    </>
  );
}, ["ROLE_USER"]);
