import { APIProvider } from "@vis.gl/react-google-maps";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GoogleMapsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{children}</APIProvider>;
};
