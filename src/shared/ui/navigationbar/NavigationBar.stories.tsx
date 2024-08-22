import { Meta, StoryObj } from "@storybook/react";
import NavigationBar from "./NavigationBar";

/* ----------leading , trailingNode 에 들어갈 예시 svg 컴포넌트 ---------- */
const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <mask
      id="mask0_372_5317"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_372_5317)">
      <path
        d="M6 18L3.7 20.3C3.38333 20.6167 3.02083 20.6875 2.6125 20.5125C2.20417 20.3375 2 20.025 2 19.575V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H13C13.2833 2 13.5208 2.09583 13.7125 2.2875C13.9042 2.47917 14 2.71667 14 3C14 3.28333 13.9042 3.52083 13.7125 3.7125C13.5208 3.90417 13.2833 4 13 4H4V17.125L5.15 16H20V9C20 8.71667 20.0958 8.47917 20.2875 8.2875C20.4792 8.09583 20.7167 8 21 8C21.2833 8 21.5208 8.09583 21.7125 8.2875C21.9042 8.47917 22 8.71667 22 9V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6ZM19 6C18.1667 6 17.4583 5.70833 16.875 5.125C16.2917 4.54167 16 3.83333 16 3C16 2.16667 16.2917 1.45833 16.875 0.875C17.4583 0.291667 18.1667 0 19 0C19.8333 0 20.5417 0.291667 21.125 0.875C21.7083 1.45833 22 2.16667 22 3C22 3.83333 21.7083 4.54167 21.125 5.125C20.5417 5.70833 19.8333 6 19 6Z"
        fill="#616161"
      />
    </g>
  </svg>
);

const BackwardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      fill="#616161"
    />
  </svg>
);

const MockupCloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
      fill="#616161"
    />
  </svg>
);

const MockUpLabel = () => <p className="title-1">Label</p>;

const MockupLogo = () => (
  <div className="h-8 w-[216px] flex-shrink-0 bg-grey-300"></div>
);

const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="flex flex-shrink-0 items-center justify-center px-3 py-3">
    {children}
  </button>
);

const meta: Meta<typeof NavigationBar> = {
  title: "shared/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  argTypes: {
    componentType: {
      description:
        "NavigationBar의 스타일을 결정합니다. type으로는 default, buttonLeft , buttonRight가 있습니다.",
    },
    button: {
      description: "NavigationBar에 들어갈 버튼입니다.",
    },
    label: {
      description: "선택적인 요소로 NavigationBar에 들어갈 라벨입니다.",
    },
  },
  parameters: {
    docs: {
      description: "페이지 상단에 존재 할 NavigationBar의 공통 컴포넌트입니다,",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof NavigationBar>;

export const Default: Story = {
  args: {
    componentType: "default",
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <h1>default</h1>
        <div className="w-90 border border-grey-200">
          <NavigationBar
            componentType="default"
            button={
              <div className="flex items-center justify-end">
                <Button>
                  <MessageIcon />
                </Button>
                <Button>
                  <MessageIcon />
                </Button>
              </div>
            }
            label={<MockupLogo />}
          />
        </div>
      </div>

      <div className="flex gap-10">
        <div>
          <h1>buttonLeft with Label</h1>
          <div className="w-90 border border-grey-200">
            <NavigationBar
              componentType="buttonLeft"
              button={
                <Button>
                  <BackwardIcon />
                </Button>
              }
              label={<MockUpLabel />}
            />
          </div>
        </div>
        <div>
          <h1>buttonLeft without Label</h1>
          <div className="w-90 border border-grey-200">
            <NavigationBar
              componentType="buttonLeft"
              button={
                <Button>
                  <BackwardIcon />
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        <div>
          <h1>buttonRight with Label</h1>
          <div className="w-90 border border-grey-200">
            <NavigationBar
              componentType="buttonRight"
              button={
                <Button>
                  <MockupCloseIcon />
                </Button>
              }
              label={<MockUpLabel />}
            />
          </div>
        </div>
        <div>
          <h1>buttonRight without Label</h1>
          <div className="w-90 border border-grey-200">
            <NavigationBar
              componentType="buttonRight"
              button={
                <Button>
                  <MockupCloseIcon />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
