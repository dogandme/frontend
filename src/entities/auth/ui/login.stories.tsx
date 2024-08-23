import { Meta, StoryObj } from "@storybook/react";
import {
  NaverLoginHyperLink,
  GoogleLoginHyperLink,
  EmailLoginHyperLink,
} from "./login";

const HyperLinkWidget = () => (
  <div className="flex w-[360px] flex-col items-start gap-4 self-stretch px-4">
    <NaverLoginHyperLink />
    <GoogleLoginHyperLink />
    <EmailLoginHyperLink />
  </div>
);

export default {
  title: "Auth/LoginHyperLink",
  component: NaverLoginHyperLink,
  // Link 컴포넌트를 사용하기 때문에 BrowserRouter 로 데코레이팅
} as Meta<typeof HyperLinkWidget>;

type Story = StoryObj<typeof HyperLinkWidget>;

export const Default: Story = {
  render: () => <HyperLinkWidget />,
};
