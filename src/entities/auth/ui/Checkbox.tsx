import { Button } from "@/shared/ui/button";
import { Checkbox, CheckboxProps } from "@/shared/ui/checkbox";

type AgreementCheckboxProps = Omit<CheckboxProps, "children"> & {
  label: string;
  agreementLink?: string;
};

export const AgreementCheckbox = ({
  checked,
  isIndeterminate,
  label,
  agreementLink,
  ...props
}: AgreementCheckboxProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Checkbox
        checked={checked}
        isIndeterminate={isIndeterminate}
        gap="1rem"
        {...props}
      >
        <span className="btn-2">{label}</span>
      </Checkbox>

      {agreementLink && (
        <Button
          type="button"
          colorType="primary"
          variant="text"
          size="xSmall"
          fullWidth={false}
          onClick={() => {
            // _blank: 새 탭에서 링크 열림
            // noopener,noreferrer: 보안을 위해 사용
            window.open(agreementLink, "_blank", "noopener,noreferrer");
          }}
        >
          보기
        </Button>
      )}
    </div>
  );
};
