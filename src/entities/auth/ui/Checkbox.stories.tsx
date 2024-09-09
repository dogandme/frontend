import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { AgreementCheckbox } from "./Checkbox";

const meta: Meta = {
  title: "entities/auth/Checkbox",
};

export default meta;

type CheckboxStory = StoryObj<typeof AgreementCheckbox>;

export const Agreement: CheckboxStory = {
  argTypes: {
    checked: {
      description: "체크박스의 선택 여부입니다.",
      control: "boolean",
    },
    isIndeterminate: {
      description:
        "해당 체크박스가 선택되었는지 혹은 선택되지 않았는지 판단할 수 없는 상태를 의미합니다. (모든 체크박스가 선택되어 있지 않지만 하나 이상 선택되어 있을 경우, true로 설정)",
      control: "boolean",
    },
    label: {
      description: "체크박스의 라벨입니다.",
      control: "text",
    },
    agreementLink: {
      description: "약관 링크 주소입니다.",
      control: "text",
    },
  },
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks  */
    const [checked1, setChecked1] = useState<boolean>(false);
    const [checked2, setChecked2] = useState<boolean>(false);

    return (
      <div className="flex flex-col gap-4">
        <AgreementCheckbox
          id="not-link"
          checked={checked1}
          label="전체 동의합니다."
          onChange={(e) => setChecked1(e.target.checked)}
        />

        <AgreementCheckbox
          id="terms-of-service-agreement"
          checked={checked2}
          label="이용약관 동의 (필수)"
          agreementLink="/"
          onChange={(e) => setChecked2(e.target.checked)}
        />
      </div>
    );
  },
};
