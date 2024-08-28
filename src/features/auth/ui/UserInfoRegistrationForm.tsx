import { AgreementCheckbox, SelectOpener } from "@/entities/auth/ui";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MapLocationSearchingIcon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { useState } from "react";

const UserInfoRegistrationForm = () => {
  // todo: 리팩토링 필요
  const [checkedItems, setCheckedItems] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // 전체 선택되어 있는 경우
  const allChecked = checkedItems.every(Boolean);
  // 전체 선택되어 있지 않고 하나 이상 선택되어 있는 경우
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  return (
    <form className="flex flex-col gap-8 self-stretch">
      <section className="flex flex-col gap-8 self-stretch">
        <Input
          type="text"
          id="nickname"
          name="nickname"
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          statusText="20자 이내의 한글 영어 숫자만 사용 가능합니다."
          essential
          componentType="outlinedText"
        />
        <SelectOpener
          id="sex"
          name="sex"
          label="성별"
          essential
          // value={"남자"}
          placeholder="성별을 선택해 주세요"
        />
        <SelectOpener
          id="age"
          name="age"
          label="연령대"
          essential
          // value={"10대"}
          placeholder="연령대를 선택해 주세요"
        />

        <div>
          <div className="flex items-start gap-1 pb-2">
            <span className="title-3 text-grey-700">동네설정</span>
            <Badge colorType="primary" />
          </div>

          <Button
            type="button"
            variant="outlined"
            colorType="tertiary"
            size="medium"
          >
            <MapLocationSearchingIcon />
            <span>동네 설정하기</span>
          </Button>
        </div>
      </section>

      <hr className="text-grey-200" />

      <section className="flex flex-col gap-4">
        <AgreementCheckbox
          id="agree-to-all-terms"
          checked={allChecked}
          isIndeterminate={isIndeterminate}
          label="전체 동의합니다."
          onChange={(e) =>
            setCheckedItems([
              e.target.checked,
              e.target.checked,
              e.target.checked,
            ])
          }
        />

        <AgreementCheckbox
          id="terms-of-service-agreement"
          checked={checkedItems[0]}
          label="이용약관 동의 (필수)"
          onChange={(e) =>
            setCheckedItems([
              e.target.checked,
              checkedItems[1],
              checkedItems[2],
            ])
          }
          agreementLink="/"
        />

        <AgreementCheckbox
          id="privacy-policy-agreement"
          label="개인정보 수집 및 이용 동의 (필수)"
          checked={checkedItems[1]}
          onChange={(e) =>
            setCheckedItems([
              checkedItems[0],
              e.target.checked,
              checkedItems[2],
            ])
          }
          agreementLink="/"
        />

        <AgreementCheckbox
          id="marketing-information-agreement"
          label="마케팅 정보 수신 동의 (선택)"
          checked={checkedItems[2]}
          onChange={(e) =>
            setCheckedItems([
              checkedItems[0],
              checkedItems[1],
              e.target.checked,
            ])
          }
          agreementLink="/"
        />
      </section>

      <Button type="submit" colorType="primary" variant="filled" size="large">
        회원가입
      </Button>
    </form>
  );
};

export default UserInfoRegistrationForm;
