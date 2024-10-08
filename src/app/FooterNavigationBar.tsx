import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { NavLink, useLocation } from "react-router-dom";
import { useMapStore } from "@/features/map/store";
import { useGetMarkingList } from "@/features/marking/api";
import { MarkingItem } from "@/features/marking/ui";
import { MarkingList } from "@/entities/marking/ui";
import { useGetProfile } from "@/entities/profile/api";
import { API_BASE_URL, ROUTER_PATH } from "@/shared/constants";
import { useAuthStore } from "@/shared/store";
import { CompassIcon, MapIcon } from "@/shared/ui/icon";

const footerNavigationBarStyles = {
  active: "text-tangerine-500",
  inactive: "text-grey-400",
  base: "body-3 text-center flex flex-col items-center justify-center gap-1",
};

export const FooterNavigationBar = () => {
  const { active, inactive, base } = footerNavigationBarStyles;
  const nickname = useAuthStore((state) => state.nickname);
  const token = useAuthStore((state) => state.token);
  const { data } = useGetProfile({
    nickname,
    token,
  });
  // TODO API 에서 받아온 프로필 이미지 사용하기
  const profileImageUrl = data?.pet?.profile
    ? `${API_BASE_URL}/pets/image/${data.pet.profile}`
    : "/default-image.png";

  const location = useLocation();

  const ref = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SheetRef>();

  const snapPoints = [-50, 0.5, 116];
  const initialSnap = snapPoints.length - 1;

  const snapPointRef = useRef(initialSnap);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  const { data: markingList } = useGetMarkingList();

  const mapMode = useMapStore((state) => state.mode);

  return (
    <footer ref={ref} className="relative">
      <Sheet
        ref={sheetRef}
        isOpen={location.pathname === "/map" && mapMode === "view"}
        onClose={() => {
          const isSheetTop = snapPointRef.current === 0;

          if (isSheetTop) {
            snapTo(snapPointRef.current - 1);
            return;
          }

          snapTo(initialSnap);
        }}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
        onSnap={(snapPointIndex) => (snapPointRef.current = snapPointIndex)}
        style={{ zIndex: 1 }}
        mountPoint={ref.current || document.querySelector("#root")!}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content
            style={{
              padding: 0,
              paddingBottom: sheetRef.current?.y,
            }}
          >
            <Sheet.Scroller
              draggableAt="both"
              style={{
                height: "calc(100% - 5rem)",
              }}
            >
              {/* todo 버튼 활성화 여부에 따라 내용 바뀜 */}
              <h1 className="title-1 text-grey-900 p-4">주변 마킹</h1>

              <div className="px-4">
                <MarkingList>
                  {markingList?.map((marking) => (
                    <MarkingItem
                      key={marking.markingId}
                      {...marking}
                      onRegionClick={() => {}}
                    />
                  ))}
                </MarkingList>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>

      <nav className="relative z-10">
        <ul className="flex justify-between items-center gap-2 bg-grey-0 px-2 h-20">
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MAIN}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <CompassIcon />
              발견
            </NavLink>
          </li>
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MAP}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <MapIcon />
              지도
            </NavLink>
          </li>
          <li className="grow">
            <NavLink
              to={ROUTER_PATH.MY_PAGE}
              className={({ isActive }) =>
                `${isActive ? active : inactive} ${base}`
              }
            >
              <img
                src={profileImageUrl}
                alt={
                  nickname
                    ? `${nickname}님의 프로필 이미지`
                    : "기본 프로필 이미지"
                }
                className="w-6 h-6 rounded-2xl flex-shrink-0"
              />
              My
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};