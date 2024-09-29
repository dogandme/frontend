import { InfoIcon } from "../icon";

interface NoticeProps {
  title?: string | JSX.Element;
  children: React.ReactNode | [React.ReactNode, React.ReactNode];
  Icon?: React.ReactNode;
  className?: string;
}
export const Notice = ({
  title,
  children,
  className = "rounded-2xl",
  Icon = <InfoIcon width={20} height={20} />,
}: NoticeProps) => {
  return (
    <div
      className={`$flex flex-col gap-1 px-4 py-[.625rem] justify-center self-stretch rounded-2xl bg-grey-50 btn-3 text-grey-500 ${className}`}
    >
      {title}
      <div className="flex gap-1 body-3">
        {Icon}
        {children}
      </div>
    </div>
  );
};
