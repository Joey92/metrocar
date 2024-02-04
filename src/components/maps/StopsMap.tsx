import React, { useEffect, useRef, useState } from "react";

import {
  TileLayer,
  MapContainer,
  CircleMarker,
  useMap,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";
import { Components } from "../../types/directus";
import { useTranslation } from "next-i18next";
import { Button, Stack } from "react-bootstrap";
import Link from "next/link";

// @ts-ignore: undefined stuff
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: iconUrl.src,
  iconRetinaUrl: iconRetinaUrl.src,
  shadowUrl: shadowUrl.src,
});

const flipCoords = (coord: number[]) =>
  [coord[1], coord[0]] as [number, number];

const Stop = ({ stop }: { stop: Components.Schemas.ItemsStops }) => {
  const markerRef = useRef(null);

  const { t } = useTranslation();

  return (
    <CircleMarker
      center={flipCoords(stop.location!.coordinates)}
      pathOptions={{
        fillColor: "white",
        color: "black",
        fillOpacity: 100,
      }}
      fill={true}
      ref={markerRef}
      key={stop.id}
    >
      <Popup>
        <Stack>
          <h4>{stop.stop_name}</h4>
          <Stack direction="horizontal" gap={3}>
            <Link href={`/stops/${stop.id}`} passHref>
              <Button>{t("pages:stop_view.view_departures")}</Button>
            </Link>

            {stop.stop_url && (
              <Link href={stop.stop_url} passHref>
                <Button>{t("pages:stop_view.view_website")}</Button>
              </Link>
            )}
          </Stack>
        </Stack>
      </Popup>
    </CircleMarker>
  );
};

const MapController = ({
  stops,
}: {
  stops: Components.Schemas.ItemsStops[];
}) => {
  const map = useMap();

  const [zoomToBounds, setZoomToBounds] = useState(true);

  useEffect(() => {
    if (zoomToBounds && stops.length > 0) {
      map.fitBounds(
        stops.map((stop) => flipCoords(stop.location!.coordinates as number[]))
      );
      setZoomToBounds(false);
    }
  }, [map, stops, zoomToBounds]);

  return (
    <>
      {stops.map((stop) => (
        <Stop key={stop.id} stop={stop} />
      ))}
    </>
  );
};

const StopsMap = ({ stops }: { stops: Components.Schemas.ItemsStops[] }) => {
  return (
    <MapContainer
      center={[50.9774553, 10.8689078]}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: "90vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController stops={stops} />
    </MapContainer>
  );
};

export default StopsMap;
