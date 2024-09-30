import { useAuthStore } from "@/shared/store";

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  // ! TODO - 개발모드에서 AuthStore 의 권한이 변경 되면 모든 컴포넌트를 리렌더링 시키기 위해 추가 했습니다.
  // 개발 모드가 아닐 경우엔 불필요한 리렌더링이 일어나지 않지만 배포 시엔 안정성을 위해 해당 코드를 제거 하도록 합니다.
  if (process.env.NODE_ENV === "development") {
    const role = useAuthStore((state) => state.role);
  }

  return (
    <div className="mx-auto my-0 flex h-screen max-w-[37.5rem] flex-col">
      {children}
    </div>
  );
};
