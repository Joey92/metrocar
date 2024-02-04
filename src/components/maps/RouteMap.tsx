import React, { useEffect, useState } from "react";

import { TileLayer, MapContainer, Polyline, useMap } from "react-leaflet";
import { Geometry } from "../../types/geo";

interface Props {
  geom: Geometry;
  color: string;
}

const MapController = ({ geom, color }: Props) => {
  const map = useMap();

  const [zoomToBounds, setZoomToBounds] = useState(true);

  useEffect(() => {
    if (zoomToBounds) {
      map.fitBounds(geom.coordinates.map((coord) => [coord[1], coord[0]]));
      setZoomToBounds(false);
    }
  }, [map, geom, zoomToBounds]);

  return (
    <Polyline
      positions={geom.coordinates.map((coord) => [coord[1], coord[0]])}
      pathOptions={{
        fillColor: "black",
        color: color ? color : "blue",
        fillOpacity: 100,
        weight: 10,
      }}
    />
  );
};

const RouteMap = (props: Props) => (
  <MapContainer
    center={[50.9774553, 10.8689078]}
    zoom={8}
    scrollWheelZoom={true}
    style={{ height: "500px" }}
  >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <MapController {...props} />
  </MapContainer>
);

export default RouteMap;
