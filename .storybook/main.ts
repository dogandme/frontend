import path from "path";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [path.join(__dirname, "../public")],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        svgr({
          // svgr options: https://react-svgr.com/docs/options/
          include: "**/*.svg", // svg 파일을 react 컴포넌트로 변환
        }),
      ],
    });
  },
};
export default config;
