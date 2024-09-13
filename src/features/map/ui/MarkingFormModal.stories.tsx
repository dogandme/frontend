import { Meta, StoryObj } from "@storybook/react";
import { OverlayPortal } from "@/app/OverlayPortal";
import { MapPage } from "@/pages/map";
import { GoogleMaps } from "@/widgets/map/ui";
import { useAuthStore } from "@/shared/store";
import { GoogleMapsProvider, MobileLayout } from "@/app";
import { MarkingFormModal } from "./MarkingFormModal";

const meta: Meta<typeof MarkingFormModal> = {
  title: "features/map/MarkingFormModal",
  component: MarkingFormModal,
};

export default meta;

type Story = StoryObj<typeof MarkingFormModal>;

export const Default: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ token: "Bearer token" });
      return (
        <div id="root">
          <GoogleMapsProvider>
            <GoogleMaps>
              <MobileLayout>
                <OverlayPortal />
                <Story />
              </MobileLayout>
            </GoogleMaps>
          </GoogleMapsProvider>
        </div>
      );
    },
  ],

  render: () => <MapPage />,
};
