import { useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button";

export const FollowItemContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <section className="px-4 pt-4 flex flex-col gap-4 overflow-y-auto">
    {children}
  </section>
);

export const FollowItemContainerSkeleton = () => {
  const { pathname } = useLocation();
  const lastPath = pathname.split("/").pop();

  return (
    <FollowItemContainer>
      {Array.from({ length: 20 }, (_, idx) => idx).map((key) => (
        <div key={key} className="px-4 flex justify-between overflow-y-auto">
          {/* 로딩 이미지 대체 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-[1.75rem] skeleton" />
            <div className="flex flex-col justify-center">
              <div className="flex gap-2">
                <p className="title-2 skeleton">유저 닉네임</p>
              </div>
              <p className="body-3 skeleton">펫 이름</p>
            </div>
          </div>
          {/* 버튼 */}
          <Button
            size="small"
            variant="outlined"
            colorType="tertiary"
            fullWidth={false}
            disabled
            className="skeleton"
          >
            <div className="w-12" />
          </Button>
        </div>
      ))}
    </FollowItemContainer>
  );
};
