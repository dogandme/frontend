import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/shared/constants";

export const GoogleMapsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{children}</APIProvider>;
};
