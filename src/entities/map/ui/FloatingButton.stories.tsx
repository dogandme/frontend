import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent } from "@storybook/test";
import {
  LocationIcon,
  MyLocationIcon,
  StarIcon,
} from "../../../shared/ui/icon";
import { FloatingButton } from "./FloatingButton";

const meta: Meta<typeof FloatingButton> = {
  title: "entities/map/FloatingButton",
  component: FloatingButton,
};

export default meta;

type Story = StoryObj<typeof FloatingButton>;

const ControlledFloatingButton = () => {
  const [state, setState] = useState(false);

  const handleState = () => {
    setState((state) => !state);
  };

  return (
    <>
      <p data-testid="external-state">{String(state)}</p>
      <FloatingButton
        onClick={handleState}
        data-testid="controlled-floating-button"
      >
        <LocationIcon />
      </FloatingButton>
    </>
  );
};

const CounterFloatingButton = () => {
  const [count, setCount] = useState(0);

  const handleCount = () => setCount(count + 1);

  return (
    <>
      <p data-testid="count">{count}</p>
      <p>
        외부에서 주입 된 onClick props와 내부에서 active 상태를 바꾸는 이벤트
        핸들러가 모두 사용되는지 확인하기 위한 예제 입니다.
      </p>
      <FloatingButton
        onClick={handleCount}
        data-testid="counter-floating-button"
      >
        <MyLocationIcon />
      </FloatingButton>
    </>
  );
};

export const Default: Story = {
  decorators: [
    (Story) => {
      return (
        <div className="flex flex-col gap-10 px-2 py-2">
          <Story />
        </div>
      );
    },
  ],
  render: () => {
    return (
      <>
        <div>
          <h1 className="title-1">Image 가 들어간 FloatingButton</h1>
          <FloatingButton imgSrc="https://via.placeholder.com/150" />
        </div>
        <div>
          <h1 className="title-1">Icon이 들어간 FloatingButton</h1>
          <FloatingButton data-testid="unControlled-floating-button">
            <StarIcon />
          </FloatingButton>
        </div>
        <div>
          <h1 className="title-1">Controlled FloatingButton</h1>
          <ControlledFloatingButton data-testid="controlled-floating-button" />
        </div>
        <div>
          <h1 className="title-1">Counter FloatingButton</h1>
          <CounterFloatingButton data-testid="counter-floating-button" />
        </div>
        <div>
          <h1 className="title-1">Disabled Floating Button</h1>
          <FloatingButton disabled>
            <MyLocationIcon />
          </FloatingButton>
        </div>
      </>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const $uncontrolledFloatingButton = canvas.getByTestId(
      "unControlled-floating-button",
    );
    const $controlledFloatingButton = canvas.getByTestId(
      "controlled-floating-button",
    );
    const $counterFloatingButton = canvas.getByTestId(
      "counter-floating-button",
    );
    const $count = canvas.getByTestId("count");

    const activeClassName = "text-tangerine-500";
    const inActiveClassName = "text-grey-500";

    await step(
      "uncontrolled floating button 을 누르면 isActive상태가 바뀐다.",
      async () => {
        await userEvent.click($uncontrolledFloatingButton);
        expect($uncontrolledFloatingButton).toHaveClass(activeClassName);
        await userEvent.click($uncontrolledFloatingButton);
        expect($uncontrolledFloatingButton).toHaveClass(inActiveClassName);
      },
    );

    await step(
      "controlled floating button 을 누르면 버튼 상태와 외부 상태가 변경된다.",
      async () => {
        await userEvent.click($controlledFloatingButton);
        expect($controlledFloatingButton).toHaveClass(activeClassName);
        expect(canvas.getByTestId("external-state")).toHaveTextContent("true");
        await userEvent.click($controlledFloatingButton);
        expect($controlledFloatingButton).toHaveClass(inActiveClassName);
        expect(canvas.getByTestId("external-state")).toHaveTextContent("false");
      },
    );

    await step(
      "counter floating button 을 누르면 floating button 의 상태가 변경되고 주입받은 onClick 함수가 실행된다.",
      async () => {
        await userEvent.click($counterFloatingButton);
        expect($counterFloatingButton).toHaveClass(activeClassName);
        expect($count).toHaveTextContent("1");
        await userEvent.click($counterFloatingButton);
        expect($counterFloatingButton).toHaveClass(inActiveClassName);
        expect($count).toHaveTextContent("2");
      },
    );
  },
};
