import React, { useEffect, useRef, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useMapStore } from "@/features/map/store";

export const MapBottomSheet = ({ children }: { children: React.ReactNode }) => {
  const sheetRef = useRef<SheetRef>();

  const snapPoints = [-50, 0.5, 116];
  const initialSnap = 1;

  const snapPointRef = useRef(initialSnap);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  const mapMode = useMapStore((state) => state.mode);

  const [contentPaddingBottom, setContentPaddingBottom] =
    useState<SheetRef["y"]>();

  useEffect(() => {
    if (sheetRef.current) {
      setContentPaddingBottom(sheetRef.current.y);
    }
  }, []);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={mapMode === "view"}
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
      mountPoint={document.querySelector("#root")!}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content
          style={{
            padding: 0,
            paddingBottom: contentPaddingBottom,
          }}
        >
          <Sheet.Scroller
            draggableAt="both"
            style={{
              height: "calc(100% - 5rem)",
            }}
          >
            {children}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
