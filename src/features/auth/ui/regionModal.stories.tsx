import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, spyOn, waitFor } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { addressHandlers } from "@/mocks/handler";
import { REGION_API_DEBOUNCE_DELAY } from "../constants";
import { RegionModal } from "./regionModal";

const meta: Meta<typeof RegionModal> = {
  title: "features/auth/RegionModal",
  tags: ["features", "auth"],
  parameters: {
    docs: {
      description: {
        component: "지역 설정 모달입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RegionModal>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: addressHandlers,
    },
  },

  decorators: [
    (Story) => {
      useAuthStore.setState({ token: "Valid token" });

      return (
        <div id="root" className="w-96">
          <Story />
        </div>
      );
    },
  ],

  render: () => {
    return (
      <div className="flex flex-col gap-10">
        <div className="w-[360px] px-2 py-2">
          <RegionModal onClose={async () => {}} onSave={() => {}} />
        </div>
      </div>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const fetchSpy = spyOn(window, "fetch");

    const CORRECT_ADDRESS_DOBONG = "도봉구 도봉동";
    const CORRECT_ADDRESS_GANGNAM = "강남구 역삼동";

    const $regionSearchInput = canvasElement.querySelector("#region-search")!;

    await step(
      `장소 입력창은 디바운스 처리가 되어 있어  ${REGION_API_DEBOUNCE_DELAY}ms 이후 API 요청을 보낸다.`,
      async () => {
        await userEvent.type($regionSearchInput, CORRECT_ADDRESS_DOBONG);

        expect(fetchSpy).not.toHaveBeenCalled();
        await waitFor(
          () => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
          },
          { timeout: REGION_API_DEBOUNCE_DELAY + 100 },
        );
      },
    );

    await step("API 요청이 성공하면 검색 결과가 나타난다.", async () => {
      const $searchedResult = await canvas.findByText(/도봉구 도봉1동/);
      expect($searchedResult).toBeInTheDocument();
    });

    fetchSpy.mockClear();

    await step(
      "입력 창에 글자가 존재하지 않으면 API 요청이 일어나지 않는다.",
      async () => {
        await userEvent.clear($regionSearchInput);
        await waitFor(
          () => {
            expect(fetchSpy).not.toHaveBeenCalled();
          },
          { timeout: REGION_API_DEBOUNCE_DELAY + 100 },
        );
      },
    );

    fetchSpy.mockClear();

    await step(
      "이전과 다른 검색어를 입력하면 다른 검색 결과가 나타난다.",
      async () => {
        await userEvent.type($regionSearchInput, CORRECT_ADDRESS_GANGNAM);
        await waitFor(
          async () => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            const $searchedResult =
              await canvas.findByText(/서울특별시 강남구 역삼1동/);
            expect($searchedResult).toBeInTheDocument();
          },
          {
            timeout: REGION_API_DEBOUNCE_DELAY + 100,
          },
        );
      },
    );
  },
};
