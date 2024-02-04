import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import { Components } from "../../types/directus";

const MapController = ({ stop }: { stop: Components.Schemas.ItemsStops }) => {
  const map = useMap();
  const [lon, lat] = stop.location!.coordinates;

  useEffect(() => {
    map.setView([lat, lon], 16);
  }, [map, lat, lon]);

  return (
    stop && (
      <CircleMarker
        center={[lat, lon]}
        pathOptions={{
          fillColor: "white",
          color: "black",
          fillOpacity: 100,
        }}
        key={stop.id}
      />
    )
  );
};

const StopMap = ({ stop }: { stop: Components.Schemas.ItemsStops }) => {
  return (
    <MapContainer
      center={[50.9774553, 10.8689078]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "500px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController stop={stop} />
    </MapContainer>
  );
};

export default StopMap;
