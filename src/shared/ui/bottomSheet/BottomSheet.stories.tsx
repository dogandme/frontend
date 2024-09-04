import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Sheet } from "react-modal-sheet";

const meta: Meta<typeof Sheet> = {
  title: "shared/BottomSheet",
  component: Sheet,
};

export default meta;

export const Default: StoryObj<typeof Sheet> = {
  parameters: {
    docs: {
      description: {
        component:
          "바텀 시트 컴포넌트는 react-modal-sheet 라이브러리를 사용합니다.",
      },
    },
  },
  render: () => {
    /* eslint-disable */
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>click!</button>
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          detent="content-height"
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <div>남자</div>
              <div>여자</div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </>
    );
  },
};
