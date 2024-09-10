import { http, HttpResponse } from "msw";
import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { ADDRESSES_END_POINT, DELAY } from "../constants";
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

          if (keyword !== "강남구 역삼동") {
            return HttpResponse.json({
              code: 204, // 검색 결과 없을 시를 가정
              message: "bad",
              content: [],
            });
          }

          return HttpResponse.json({
            code: 200,
            message: "good",
            content: [
              {
                id: 0,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼1동",
                subDistrict: "123-45",
              },
              {
                id: 1,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼2동",
                subDistrict: "123-45",
              },
              {
                id: 2,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼3동",
                subDistrict: "123-45",
              },
              {
                id: 3,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼4동",
                subDistrict: "123-45",
              },
            ],
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
                cityCounty: "강남구",
                district: "역삼1동",
                subDistrict: "123-45",
              },
              {
                id: 1,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼2동",
                subDistrict: "123-45",
              },
              {
                id: 2,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼3동",
                subDistrict: "123-45",
              },
              {
                id: 3,
                province: "서울특별시",
                cityCounty: "강남구",
                district: "역삼4동",
                subDistrict: "123-45",
              },
            ],
          });
        }),
      ],
    },
  },

  decorators: [
    (Story) => (
      <div id="root" className="w-96">
        <Story />
      </div>
    ),
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
    const $regionSearchInput = canvasElement.querySelector("#region-search")!;
  },
};
