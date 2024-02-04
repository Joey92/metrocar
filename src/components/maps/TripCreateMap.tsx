import { LeafletEventHandlerFnMap } from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
  Marker,
} from "react-leaflet";
import { Waypoint } from "../../redux/reducers/trip_editor";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { StopOnATrip } from "../../types/backend";

// @ts-ignore: undefined stuff
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

interface TripCreateMapProps {
  routeShapeCoordinates?: [number, number][];
  stops: StopOnATrip[];
  waypoints?: Waypoint[];
  deleteWaypoint?: (idx: number) => void;
  addWaypoint?: (wp: Waypoint) => void;
  updateWaypoint?: (idx: number, wp: Waypoint) => void;
}

const WaypointMarker = ({
  wp,
  update,
  del,
}: {
  wp: Waypoint;
  update: (wp: Waypoint) => void;
  del: () => void;
}) => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () =>
      ({
        dragend() {
          const marker = markerRef.current as any;

          if (!marker) {
            return;
          }
          const { lat, lng } = marker.getLatLng();
          update([lng, lat]);
        },
        dblclick() {
          del();
        },
      } as LeafletEventHandlerFnMap),
    [del, update]
  );

  return (
    <Marker
      eventHandlers={eventHandlers}
      position={wp}
      draggable={true}
      ref={markerRef}
    />
  );
};

const MapController = ({
  routeShapeCoordinates,
  stops,
  waypoints,
  addWaypoint,
  updateWaypoint,
  deleteWaypoint,
}: TripCreateMapProps) => {
  const map = useMap();

  const mapLayers = [];

  useEffect(() => {
    if (routeShapeCoordinates) {
      map.fitBounds(routeShapeCoordinates);
      return;
    }

    const bounds = stops
      .map(
        (s) =>
          [s.location?.coordinates[1], s.location?.coordinates[0]] as [
            number,
            number
          ]
      )
      .filter((s) => s);

    if (bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [map, routeShapeCoordinates, stops]);

  const eventHandlers = useMemo(
    () =>
      ({
        click(evt) {
          if (!addWaypoint) {
            return;
          }
          addWaypoint([evt.latlng.lng, evt.latlng.lat]);
        },
      } as LeafletEventHandlerFnMap),
    [addWaypoint]
  );

  if (routeShapeCoordinates) {
    const pathOptions = {
      fillColor: "black",
      color: "blue",
      fillOpacity: 100,
      weight: 6,
    };
    mapLayers.push(
      <Polyline
        pathOptions={pathOptions}
        eventHandlers={eventHandlers}
        key="path"
        positions={routeShapeCoordinates}
      />
    );
  }

  if (waypoints) {
    mapLayers.push(
      ...waypoints.map((wp, idx) => (
        <WaypointMarker
          key={idx}
          wp={[wp[1], wp[0]]}
          update={(wp: Waypoint) =>
            updateWaypoint ? updateWaypoint(idx, wp) : null
          }
          del={() => (deleteWaypoint ? deleteWaypoint(idx) : null)}
        />
      ))
    );
  }

  mapLayers.push(
    ...stops.map((stop: StopOnATrip) => (
      <CircleMarker
        center={[stop.location?.coordinates[1], stop.location?.coordinates[0]]}
        pathOptions={{
          fillColor: stop.features.selected ? "white" : "gray",
          color: "black",
          fillOpacity: 100,
        }}
        key={stop.id}
        fill={true}
      />
    ))
  );

  return <>{mapLayers}</>;
};

const TripCreateMap = ({
  routeShapeCoordinates: coordinates,
  stops,
  waypoints,
  deleteWaypoint,
  addWaypoint,
  updateWaypoint,
}: TripCreateMapProps) => (
  <MapContainer
    center={[50.9774553, 10.8689078]}
    zoom={8}
    scrollWheelZoom={true}
    style={{ minHeight: "500px" }}
  >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <MapController
      routeShapeCoordinates={coordinates}
      stops={stops}
      waypoints={waypoints}
      deleteWaypoint={deleteWaypoint}
      addWaypoint={addWaypoint}
      updateWaypoint={updateWaypoint}
    />
  </MapContainer>
);

export default TripCreateMap;
