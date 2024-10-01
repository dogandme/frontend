import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/global.css";

initialize();

const queryClient = new QueryClient();

const withProviders = (Story, context) => {
  const { initialEntries, initialIndex } =
    context.parameters.memoryRouter || {};

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <Story />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
  // 모든 스토리에 전역적으로 react-router-dom을 적용
  decorators: [withProviders],
};

export default preview;
