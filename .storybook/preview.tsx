import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import type { Preview } from "@storybook/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useCreateQueryClient } from "../src/app/ReactQueryProvider/useCreateQueryClient";
import "../src/global.css";

initialize();

const WithProviders = (Story, context) => {
  // const navigate = useNavigate();

  const queryClient = useCreateQueryClient();

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
  decorators: [WithProviders],
};

export default preview;
