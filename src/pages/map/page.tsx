import { GoogleMaps, MarkingButton } from "@/features/map/ui";
import { FloatingButton } from "@/entities/map/ui";
import { LocationIcon, MyLocationIcon, StartIcon } from "@/shared/ui/icon";
export const MapPage = () => {
  return (
    <div className="relative h-full">
      <GoogleMaps />
      <div className="absolute bottom-[60px] flex w-full flex-col gap-2 px-4">
        {/* TODO 버튼들 기능 붙혀서 리팩토링 하기 */}
        <div className="flex justify-between">
          <div className="flex items-end">
            <FloatingButton>
              <MyLocationIcon />
            </FloatingButton>
          </div>
          <div className="flex flex-col gap-2">
            <FloatingButton imgSrc="http://localhost:5173/default-profile.svg" />
            <FloatingButton>
              <LocationIcon />
            </FloatingButton>
            <FloatingButton>
              <StartIcon />
            </FloatingButton>
          </div>
        </div>
        <MarkingButton />
        <div className="fixed bottom-[7.5rem] left-0 flex w-full justify-between px-4">
          {/* TODO 현재 지도 중심을 기준으로 해당 로고를 클릭하면 구글 맵스에서 열릴 수 있도록 src 설정하기 */}
          <img src="/public/google_on_white.png" alt="google-logo" />
          <p className="flex items-center gap-1 text-center text-[11px] text-grey-700">
            <span>지도 데이터 @2024 TMap Mobility</span>
            <a
              href="https://www.google.com/intl/ko-KR_US/help/terms_maps/"
              target="_blank"
            >
              약관
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
