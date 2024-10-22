import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useSnackBar } from "@/shared/lib/snackbar";
import { Snackbar } from "./Snackbar";

const meta: Meta<typeof Snackbar> = {
  title: "shared/Snackbar",
  tags: ["autodocs"],
  component: Snackbar,
  parameters: {
    docs: {
      description: {
        component:
          "InfoSnackBar 컴포넌트는 사용자에게 정보를 제공하는 스낵바입니다. 스낵바는 기본적으로 1000ms 이후 자동으로 언마운트 됩니다. 만약 자동으로 언마운트 하지 않으려면 autoHideDuration을 null로 설정하세요. InfoSnackBar는 필수적으로 useOverlay 를 이용하여 호출해야 합니다.",
      },
    },
  },

  argTypes: {
    children: {
      description: "스낵바에 표시할 메시지 혹은 컴포넌트 입니다.",
      control: {
        type: "text",
      },
    },
    className: {
      description: "스낵바의 위치를 지정하는 클래스명입니다.",
      control: {
        type: "text",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Snackbar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "기본적인 스낵바입니다. 스낵바는 1000ms 이후 자동으로 사라집니다. 진행 중인 웹앱에서 실제 사용되는 예시를 보려면 PetInfoForm.stories.tsx 를 참고하세요.",
      },
    },
  },

  decorators: [
    (Story) => (
      <div className="relative w-fit">
        {/* body 태그 역할 */}
        <div id="root">
          <OverlayPortal />
          <Story />
        </div>
      </div>
    ),
  ],

  render: () => {
    /* eslint-disable */
    const handleOpenSnackbar = useSnackBar();

    return (
      <div className="flex h-96 w-full items-end justify-end px-2 py-2 gap-2">
        <button
          className="px-2 py-2 bg-grey-200"
          onClick={() => handleOpenSnackbar("1번 스낵바 오픈")}
        >
          1번 스낵바 열기
        </button>
        <button
          className="px-2 py-2 bg-grey-200"
          onClick={() =>
            handleOpenSnackbar("2번 스낵바 오픈", {
              className:
                "absolute top-16 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-grey-200",
            })
          }
        >
          2번 스낵바 열기
        </button>
      </div>
    );
  },
};
