import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app/OverlayPortal";
import { useSnackBar } from "@/shared/lib/overlay";
import { Snackbar } from "./Snackbar";
import { userEvent, expect, within } from "@storybook/test";

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
    onClose: {
      description:
        "useOverlay 를 통해 생성되는 onClose를 받기 위한 props 입니다.",
    },
    children: {
      description: "스낵바에 표시할 메시지 혹은 컴포넌트 입니다.",
      control: {
        type: "text",
      },
    },

    autoHideDuration: {
      control: {
        type: "number",
      },
      description:
        "스낵바가 자동으로 사라지는 시간 (ms), 기본적으로 InfoSnackbar는 1초 후 사라집니다. 만약 사라지기를 원치 않는 경우엔 null 을 전달해 주세요",
    },
    positionClassName: {
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
    const { handleOpen, onClose } = useSnackBar(() => (
      <Snackbar onClose={onClose}>스낵바가 열렸습니다</Snackbar>
    ));

    return (
      <div className="flex h-96 w-full items-end justify-end px-2 py-2">
        <button className="bg-tangerine-50 px-2 py-2" onClick={handleOpen}>
          스낵바 열기
        </button>
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $button = canvasElement.querySelector("button")!;

    await step("스낵바 열기를 클릭하면", async () => {
      await userEvent.click($button);

      await step("스낵바 컴포넌트가 렌더링 됩니다.", () => {
        expect(canvas.queryByText("스낵바가 열렸습니다")).toBeInTheDocument();
      });

      await step(
        "스낵바 컴포넌트의 닫힘 버튼을 클릭하면 스낵바가 사라집니다.",
        async () => {
          const $closeButton = canvas.getByLabelText(
            "info-snackbar-close-button",
          );

          await userEvent.click($closeButton);

          expect(
            canvas.queryByText("스낵바가 열렸습니다"),
          ).not.toBeInTheDocument();
        },
      );
    });

    await step(
      "스낵바를 열고 나서 1초가 지나면 자동으로 스낵바는 사라진다.",
      async () => {
        await userEvent.click($button);

        expect(canvas.queryByText("스낵바가 열렸습니다")).toBeInTheDocument();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(
          canvas.queryByText("스낵바가 열렸습니다"),
        ).not.toBeInTheDocument();
      },
    );
  },
};
