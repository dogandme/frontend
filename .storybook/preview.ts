import { withRouter } from "storybook-addon-remix-react-router";
import "../src/global.css";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // 모든 스토리에 전역적으로 react-router-dom을 적용
  decorators: [withRouter],
};

export default preview;
