import { http, HttpResponse } from "msw";
import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, spyOn, waitFor } from "@storybook/test";
import { useAuthStore } from "@/shared/store/auth";
import { REGION_API_DEBOUNCE_DELAY } from "../constants";
import { useUserInfoRegistrationFormStore } from "../store";
import { RegionModal } from "./RegionModal";

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
      handlers: [
        http.get("http://localhost/addresses", (req) => {
          const {
            request: { url },
          } = req;

          const URLObject = new URL(url);
          const keyword = URLObject.searchParams.get("keyword");

          if (keyword === "강남구 역삼동") {
            return HttpResponse.json({
              code: 200,
              message: "good",
              content: [
                {
                  id: 0,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼1동",
                  district: "123-45",
                },
                {
                  id: 1,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼2동",
                  district: "123-45",
                },
                {
                  id: 2,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼3동",
                  district: "123-45",
                },
                {
                  id: 3,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼4동",
                  district: "123-45",
                },
                {
                  id: 4,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼5동",
                  district: "123-45",
                },
                {
                  id: 5,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼6동",
                  district: "123-45",
                },
                {
                  id: 6,
                  province: "서울특별시",
                  cityCounty: "강남구",
                  subDistrict: "역삼7동",
                  district: "123-45",
                },
              ],
            });
          }

          if (keyword === "도봉구 도봉동") {
            return HttpResponse.json({
              code: 200,
              message: "good",
              content: [
                {
                  id: 0,
                  province: "서울특별시",
                  cityCounty: "도봉구",
                  subDistrict: "도봉1동",
                  district: "123-45",
                },
                {
                  id: 1,
                  province: "서울특별시",
                  cityCounty: "도봉구",
                  subDistrict: "도봉2동",
                  district: "123-45",
                },
                {
                  id: 2,
                  province: "서울특별시",
                  cityCounty: "도봉구",
                  subDistrict: "도봉3동",
                  district: "123-45",
                },
                {
                  id: 3,
                  province: "서울특별시",
                  cityCounty: "도봉구",
                  subDistrict: "도봉4동",
                  district: "123-45",
                },
              ],
            });
          }

          return HttpResponse.json({
            code: 204, // 검색 결과 없을 시를 가정
            message: "bad",
            content: [],
          });
        }),
        http.get("http://localhost/addresses/search-by-location", () => {
          return HttpResponse.json({
            code: 200,
            message: "good",
            content: [
              {
                id: 0,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 1가",
                district: "123-45",
              },
              {
                id: 1,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 2가",
                district: "123-45",
              },
              {
                id: 2,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 3가",
                district: "123-45",
              },
              {
                id: 3,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 4가",
                district: "123-45",
              },
              {
                id: 4,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 5가",
                district: "123-45",
              },
              {
                id: 5,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 6가",
                district: "123-45",
              },
              {
                id: 6,
                province: "서울특별시",
                cityCounty: "영등포구",
                subDistrict: "영등포 7가",
                district: "123-45",
              },
            ],
          });
        }),
      ],
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
          <RegionModal onClose={async () => {}} />
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
            const $searchedResult = await canvas.findByText(/강남구 역삼1동/);
            expect($searchedResult).toBeInTheDocument();
          },
          {
            timeout: REGION_API_DEBOUNCE_DELAY + 100,
          },
        );
      },
    );

    // await step(
    //   `현재 위치를 클릭하면 서울 영등포구의 검색 결과가 나타난다.`,
    //   async () => {
    //     await userEvent.click($currentLocationButton);
    //     await waitFor(
    //       async () => {
    //         expect(fetchSpy).toHaveBeenCalledTimes(1);
    //         const $searchedResult = await canvas.findByText(/영등포 1가/);
    //         expect($searchedResult).toBeInTheDocument();
    //       },
    //       {
    //         timeout: REGION_API_DEBOUNCE_DELAY + 100,
    //       },
    //     );
    //   },
    // );

    /* 현재 에러 바운더리에 대한 처리가 되어 있지 않아 에러 핸들링 테스트 코드는 추후 추가 예정입니다. */

    await step(
      "검색 결과에 존재하는 값을 클릭하면 해당 동네가 Form 데이터에 저장된다.",
      async () => {
        const $searchedResult = canvas.getByText(/강남구 역삼1동/);

        await userEvent.click($searchedResult);
        const { region } = useUserInfoRegistrationFormStore.getState();

        const $selectedRegion = canvas.getAllByText(/강남구 역삼1동/)[1];
        const $regionTitle = canvas.getByText(/선택된 동네/);

        expect(
          region.some((data) => data.address === "서울특별시 강남구 역삼1동"),
        ).toBeTruthy();
        expect($regionTitle).toBeInTheDocument();
        expect($selectedRegion).toBeInTheDocument();

        await step("동네는 최대 5개까지만 선택 할 수 있다.", async () => {
          const addresses = [
            "강남구 역삼2동",
            "강남구 역삼3동",
            "강남구 역삼4동",
            "강남구 역삼5동",
            "강남구 역삼6동",
          ];

          for (const address of addresses) {
            const $searchedResult = canvas.getByText(new RegExp(address));
            await userEvent.click($searchedResult);
          }

          const { region } = useUserInfoRegistrationFormStore.getState();
          expect(region.length).toBe(5);
          expect(region[region.length - 1].address).toBe(
            "서울특별시 강남구 역삼5동",
          );
        });

        await step(
          "선택한 동네를 클릭하면 폼 데이터에서 제거 된다.",
          async () => {
            const $selectedRegion =
              canvas.getAllByText(/서울특별시 강남구 역삼5동/)[1];
            await userEvent.click($selectedRegion);
            const { region } = useUserInfoRegistrationFormStore.getState();
            expect(
              region.some(
                (data) => data.address === "서울특별시 강남구 역삼5동",
              ),
            ).toBeFalsy();
            expect($selectedRegion).not.toBeInTheDocument();
          },
        );
      },
    );
  },
};
