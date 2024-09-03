import { Map } from "@vis.gl/react-google-maps";
import { mapOptions } from "../constants";
import { useEffect } from "react";

/**
 * 기본적으로 GoogleMaps 는 w-full h-full relative로 설정 되어 있습니다.
 */
export const GoogleMaps = () => {
  // 해당 useEffect는 Google Maps API를 사용할 때, 기본적으로 제공되는 outline을 제거하기 위한 코드입니다.
  // 기본 outline에 해당하는 div 태그는 iframe 태그 다음에 존재하고 있습니다.
  // iframe의 경우 기본 마운트보다 늦게 마운트 되기 때문에 interval을 이용해 iframe을 찾을 때 까지 비동기적으로 반복합니다.
  useEffect(() => {
    const interval = setInterval(() => {
      const $iframe = document.querySelector("iframe");
      if (!$iframe) {
        return;
      }
      const $defaultOutline = $iframe.nextElementSibling as HTMLDivElement;
      if ($defaultOutline) {
        $defaultOutline.style.display = "none";
        $defaultOutline.onfocus = () => {}; // onFocus 이벤트를 빈 함수로 설정하여 outline을 제거합니다.
        $defaultOutline.onblur = () => {}; // onBlur 이벤트를 빈 함수로 설정하여 outline을 제거합니다.
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return (
    <Map
      options={mapOptions}
      defaultCenter={{ lat: 37.5665, lng: 126.978 }}
      defaultZoom={16}
      reuseMaps // Map 컴포넌트가 unmount 되었다가 다시 mount 될 때 기존의 map instance 를 재사용 하여 memory leak을 방지합니다.
    ></Map>
  );
};
