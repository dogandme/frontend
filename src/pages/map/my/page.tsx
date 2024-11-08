import { MyMarkingList } from "@/widgets/map/ui";
import { MarkingPins } from "@/entities/map/ui";
import { useGetMyMakerList } from "@/entities/marking/api";

export const MyMarkingPage = () => {
  const { data } = useGetMyMakerList();

  return (
    <>
      {data && <MarkingPins {...data} />}
      <MyMarkingList />
    </>
  );
};
