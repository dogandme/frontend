import { useMap } from "@vis.gl/react-google-maps";

export const GoogleMapsCopyRight = () => {
  const map = useMap();

  /**
   * 해당 핸들 클릭 이벤트는 기본 Google Logo 를 클릭하면 보고 있는 지도의 중심으로 구글 맵스가 열리던 것을 구현한 것입니다.
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const center = map.getCenter();
    const centerString = center.toString();
    const url = `https://www.google.com/maps?ll=${centerString.substring(1, centerString.length - 1)}&z=16&t=m&hl=ko-KR&gl=US&mapclient=apiv3`;
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <div className="absolute -bottom-6 left-0 flex w-full justify-between px-4">
      <a href="https://www.google.co.kr/maps/?hl=ko" onClick={handleClick}>
        <img src="/public/google_on_white.png" alt="google-logo" />
      </a>
      <p className="flex items-end gap-1 text-center text-[11px] text-grey-700">
        <span>지도 데이터 &copy;2024 TMap Mobility</span>
        <a
          href="https://www.google.com/intl/ko-KR_US/help/terms_maps/"
          target="_blank"
          rel="noreferrer noopener"
        >
          약관
        </a>
      </p>
    </div>
  );
};
