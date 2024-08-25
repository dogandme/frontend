import { Meta, StoryObj } from "@storybook/react";
import { OAuthLoginHyperLinks, EmailLoginHyperLink } from "./hyperlinks";

const HyperLinkWidget = () => (
  <div className="flex w-[360px] flex-col items-start gap-4 self-stretch px-4">
    <OAuthLoginHyperLinks />
    <EmailLoginHyperLink />
  </div>
);

export default {
  title: "Auth/LoginHyperLink",
  component: HyperLinkWidget,
} as Meta<typeof HyperLinkWidget>;

type Story = StoryObj<typeof HyperLinkWidget>;

export const Default: Story = {
  render: () => <HyperLinkWidget />,
};
