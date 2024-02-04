import {
  TileLayer,
  MapContainer,
  CircleMarker,
  // useMap,
  Polyline,
  useMap,
} from "react-leaflet";

import { decode } from "@googlemaps/polyline-codec";

import { Itinerary } from "../../types/backend";

interface StopMarker {
  lat: number;
  lon: number;
  stopId?: string;
}

const getStopMarker = (stop: StopMarker) => (
  <CircleMarker
    center={[stop.lat, stop.lon]}
    pathOptions={{
      fillColor: "white",
      color: "black",
      fillOpacity: 100,
    }}
    key={stop.stopId}
  />
);

const ItinaryRoute = ({ itinerary }: { itinerary: Itinerary }) => {
  const map = useMap();

  map.fitBounds(
    itinerary.legs.flatMap((leg) => decode(leg.legGeometry.points))
  );

  return (
    <>
      {[
        ...itinerary.legs
          .filter((leg) => !leg.transitLeg)
          .map((leg, idx) => {
            const pathOptions = {
              color: "blue",
              fillOpacity: 100,
              dashArray: "8",
              weight: 5,
            };
            return (
              <Polyline
                key={`walk-${idx}`}
                pathOptions={pathOptions}
                positions={decode(leg.legGeometry.points)}
              />
            );
          }),
        ...itinerary.legs
          .filter((leg) => leg.transitLeg)
          .map((leg) => {
            const pathOptions = {
              fillColor: "black",
              color: leg.routeColor ? leg.routeColor : "blue",
              fillOpacity: 100,
              weight: 10,
            };

            const intermediateStops = leg.intermediateStops || [];

            return [
              <Polyline
                pathOptions={pathOptions}
                positions={decode(leg.legGeometry.points)}
                key="line"
              />,
              getStopMarker(leg.from),
              getStopMarker(leg.to),
              ...intermediateStops.map(getStopMarker),
            ];
          }),
      ]}
    </>
  );
};

const SearchMap = ({ itinerary }: { itinerary: Itinerary }) => {
  return (
    <MapContainer
      center={[52.579501, 13.576265]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ minHeight: "500px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ItinaryRoute itinerary={itinerary} />
    </MapContainer>
  );
};

export default SearchMap;
