interface NoticeProps {
  title?: string | JSX.Element;
  children: React.ReactNode | [React.ReactNode, React.ReactNode];
  className?: string;
}
export const Notice = ({
  title,
  children,
  className = "rounded-2xl",
}: NoticeProps) => {
  return (
    <div
      className={`$flex flex-col gap-1 px-4 py-[.625rem] justify-center self-stretch rounded-2xl bg-grey-50 btn-3 text-grey-500 ${className}`}
    >
      {title}
      <div className="flex gap-1 body-3">{children}</div>
    </div>
  );
};
