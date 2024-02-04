import {
  TileLayer,
  MapContainer,
  CircleMarker,
  useMap,
  Popup,
  Marker,
  useMapEvents,
} from "react-leaflet";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import L, { Marker as LeafletMarker } from "leaflet";
import { Components } from "../../types/directus";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

// @ts-ignore: undefined stuff
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

const flipCoords = (coord: [number, number]): [number, number] => [
  coord[1],
  coord[0],
];

interface StopProps {
  stop: Components.Schemas.ItemsStops;
  admin: boolean;
  save: (updatedStop: Components.Schemas.ItemsStops) => void;
  updating: boolean;
}

const Stop = ({ stop, admin = false, save, updating = false }: StopProps) => {
  const [stop_name, setName] = useState(stop.stop_name);
  const markerRef = useRef(null as LeafletMarker | null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        if (!admin) {
          return;
        }
        const marker = markerRef.current;

        if (!marker) {
          return;
        }

        const { lat, lng } = marker.getLatLng();
        save({
          id: stop.id,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        });
      },
    }),
    [admin, save, stop]
  );

  const { t } = useTranslation();

  if (!admin) {
    return (
      <CircleMarker
        center={flipCoords(stop.location!.coordinates)}
        pathOptions={{
          fillColor: "white",
          color: "black",
          fillOpacity: 100,
        }}
        fill={true}
        key={stop.id}
        eventHandlers={eventHandlers}
      >
        <Popup>
          {stop.stop_url ? (
            <a href={stop.stop_url}>{stop.stop_name}</a>
          ) : (
            stop.stop_name
          )}
        </Popup>
      </CircleMarker>
    );
  }

  return (
    <Marker
      position={flipCoords(stop.location!.coordinates)}
      draggable={admin}
      ref={markerRef}
      key={stop.id}
      eventHandlers={eventHandlers}
    >
      <Popup>
        {stop.stop_url ? (
          <a href={stop.stop_url}>{stop.stop_name}</a>
        ) : (
          stop.stop_name
        )}
        <Form
          onSubmit={(evt) => {
            evt.preventDefault();
            save({
              id: stop.id,
              stop_name,
              location: stop.location,
            });
          }}
        >
          {stop.id && (
            <>
              <p>
                {stop.active ? (
                  <Badge bg="success">{t("pages:report_stop.active")}</Badge>
                ) : (
                  <Badge bg="secondary">
                    {t("pages:report_stop.inactive")}
                  </Badge>
                )}
              </p>
              <p>{t("pages:report_stop.edit_disclaimer")}</p>
            </>
          )}
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              required
              type="text"
              placeholder={t("pages:report_stop.stop_name")}
              value={stop_name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </Form.Group>
          <Button type="submit">
            {updating ? (
              <Spinner animation="border" />
            ) : (
              t("pages:report_stop.suggest")
            )}
          </Button>
        </Form>
      </Popup>
    </Marker>
  );
};

const MapController = ({ stops, userId, reportStop, loading }: props) => {
  const map = useMap();

  const [newStop, setNewStop] = useState(
    null as Components.Schemas.ItemsStops | null
  );
  const [zoomToBounds, setZoomToBounds] = useState(true);

  useMapEvents({
    click: (evt) => {
      if (!userId) {
        return;
      }
      const { lat, lng } = evt.latlng;

      setNewStop({
        ...newStop,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
    },
  });

  useEffect(() => {
    if (zoomToBounds && stops.length > 0) {
      const bounds = stops
        .filter((stop) => stop.location)
        .map((stop) => flipCoords(stop.location!.coordinates));
      map.fitBounds(bounds);
      setZoomToBounds(false);
    }
  }, [map, stops, zoomToBounds]);

  return (
    <>
      {[
        ...Array.from(stops)
          .filter((stop) => stop.location)
          .map((stop) => (
            <Stop
              updating={loading}
              key={stop.id}
              stop={stop}
              // user is admin because station is not active.
              // That can only mean he is the creator
              // because the list of stops only contains active stops OR current user = reporter
              admin={stop.active === false || stop.active === null} // stop.active can be undefined, so explicitly check if false
              save={reportStop}
            />
          )),
        newStop ? (
          <Stop
            updating={loading}
            key="new-stop"
            stop={newStop}
            admin={true}
            save={(updatedStop: Components.Schemas.ItemsStops) => {
              reportStop(updatedStop);
              setNewStop(null);
            }}
          />
        ) : null,
      ]}
    </>
  );
};

interface props {
  loading: boolean;
  userId?: string | null;
  stops: Components.Schemas.ItemsStops[];
  reportStop: (stop: Components.Schemas.ItemsStops) => void;
}

const StopEditMap = ({ loading, userId, stops, reportStop }: props) => (
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
    <MapController
      loading={loading}
      userId={userId}
      stops={Object.values(stops)}
      reportStop={reportStop}
    />
  </MapContainer>
);

export default StopEditMap;
