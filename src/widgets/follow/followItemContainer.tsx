export const FollowItemContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <section className="px-4 pt-4 flex flex-col gap-4 overflow-y-auto">
    {children}
  </section>
);
