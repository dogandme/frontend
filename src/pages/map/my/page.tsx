import { MyMarkingListBottomSheet } from "@/widgets/map/ui";
import { MarkingPins } from "@/entities/map/ui";
import { useGetMyMakerList } from "@/entities/marking/api";
import { withAuth } from "@/shared/lib";

const MyMarkingPage = withAuth(() => {
  const { data } = useGetMyMakerList();

  return (
    <>
      {data && <MarkingPins tiles={data} />}
      <MyMarkingListBottomSheet />
    </>
  );
}, ["ROLE_USER"]);

export default MyMarkingPage;
