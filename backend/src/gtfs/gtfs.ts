import archiver from 'archiver';
import stringify from 'csv-stringify/lib/sync';
import { RequestHandler } from 'express';
import _ from 'lodash';
import { INTERNAL_DEFAULT_AGENCY_ID } from '../common/config';
import { db } from '../common/db';

interface GTFSData {
  header: string[];
  values: any[][];
}

interface GTFSKeys {
  stops: GTFSData;
  agency: GTFSData;
  routes: GTFSData;
  stop_times: GTFSData;
  trips: GTFSData;
  calendar_dates: GTFSData;
  calendar: GTFSData;
  feed_info: GTFSData;
  shapes: GTFSData;
  fare_attributes: GTFSData;
  fare_rules: GTFSData;
}

/**
 * Because of how OTP imports map data, we have to select only trips that our map export allows.
 * @see ../map.ts
 */
export const getGTFSData = async (): Promise<GTFSKeys> => {
  const queries = await db.tx((tx) => {
    return tx.batch([
      // stops.txt
      tx.result(
        `SELECT
        s.id as stop_id,
        ST_X(s.location) as stop_lon,
        ST_Y(s.location) as stop_lat,
        s.stop_name,
        s.stop_code,
        s.stop_desc,
        COALESCE(s.tts_stop_name, s.stop_name) as tts_stop_name,
        s.zone_id,
        s.parent_stop_id,
        s.stop_timezone,
        s.wheelchair_boarding,
        s.level_id,
        s.platform_code,
        s.location_type
        FROM stops s
        INNER JOIN stop_times st ON s.id = st.stop
        INNER JOIN trips as t on t.id = st.trip
        LEFT JOIN calendar as c on t.calendar = c.id
        WHERE t.start_date > NOW() - INTERVAL '2 days' or c.end_date > NOW() - INTERVAL '2 days'
        GROUP BY s.id`, // select only stops that have a trip
      ),
      // agencies.txt
      tx.result(`SELECT
        id as agency_id,
        *
        FROM agencies
        -- UNION
        -- SELECT
        -- id as agency_id,
        -- display_name as agency_name,
        -- agency_timezone as
        `),
      // routes.txt
      tx.result(`SELECT
        id as route_id,
        COALESCE(agency, '${INTERNAL_DEFAULT_AGENCY_ID}') as agency_id,
        3 as continuous_drop_off,
        3 as continuous_pickup,
        route_color,
        route_text_color,
        route_short_name,
        route_type
        FROM routes`),
      // stop_times.txt
      // the hours in arrival and departure time are REQUIRED to get the 24+ time GTFS needs
      tx.result(`SELECT
        t.id as trip_id,
        TO_CHAR(arrival::interval + make_interval(hours => arrival_day * 24), 'HH24:MI:SS') as arrival_time,
        TO_CHAR(departure::interval + make_interval(hours => departure_day * 24), 'HH24:MI:SS') as departure_time,
        stop as stop_id,
        stop_sequence,
        stop_headsign,
        shape_dist_traveled,
        pickup_type,
        drop_off_type,
        continuous_pickup,
        continuous_drop_off,
        timepoint
        FROM stop_times st
        INNER JOIN trips as t on t.id = st.trip
        LEFT JOIN calendar as c on t.calendar = c.id
        WHERE t.start_date > NOW() - INTERVAL '2 days' or c.end_date > NOW() - INTERVAL '2 days'
        `),
      // trips.txt
      tx.result(`SELECT
        t.route as route_id,
        COALESCE(t.calendar, t.id) as service_id,
        t.id as trip_id,
        'undefined' as trip_headsign,
        'undefined' as trip_short_name,
        t.direction_id,
        t.block_id,
        t.shape as shape_id,
        t.wheelchair_accessible,
        t.bikes_allowed
        FROM trips t
        LEFT JOIN calendar as c on t.calendar = c.id
        WHERE t.start_date > NOW() - INTERVAL '2 days' or c.end_date > NOW() - INTERVAL '2 days'`),
      // calendar_dates.txt
      tx.result(
        "SELECT id as service_id, to_char(start_date, 'YYYYMMDD') as date, 1 as exception_type FROM trips WHERE start_date IS NOT NULL",
      ),
      // calendar.txt
      tx.result(`SELECT
            id as service_id,
            monday::int,
            tuesday::int,
            wednesday::int,
            thursday::int,
            friday::int,
            saturday::int,
            sunday::int,
            to_char(start_date, 'YYYYMMDD') as start_date,
            to_char(end_date, 'YYYYMMDD') as end_date
            FROM calendar c
            WHERE c.end_date > NOW() - INTERVAL '2 days'
            `),

      // TODO move to trip shape geom

      // run this in db

      /**
       * update stops set location = st_point(stop_lon, stop_lat);

update trips
set (shape_geom) = (select
    st_makeline(st_point(shape_pt_lat, shape_pt_lon))
  from shapes
  where shape_id = trips.shape
  group by shape_id);

update trips
set (shape_annotation) = (select
    json_agg(shape_dist_traveled)
  from shapes
  where shape_id = trips.shape
  group by shape_id);

       */
      // shapes.txt
      tx.result(`SELECT
      s.id as shape_id,
      ST_Y((s.points).geom) as shape_pt_lat,
      ST_X((s.points).geom) as shape_pt_lon,
      (s.points).path[1] as shape_pt_sequence,
      s.shape_dist->(s.points).path[1] - 1 as shape_dist_traveled
      FROM (select id, ST_DumpPoints(shape) as points, shape_dist from shapes) as s
      INNER JOIN trips as t on t.shape = s.id
      LEFT JOIN calendar as c on t.calendar = c.id
      WHERE t.start_date > NOW() - INTERVAL '2 days' or c.end_date > NOW() - INTERVAL '2 days'
      ORDER BY shape_id, shape_pt_sequence`),

      // fare_attributes.txt
      tx.result(
        `
      select
      distinct encode(digest(concat(r.id, s.id, s2.id), 'sha1'), 'hex') as fare_id,
      ((st2.shape_dist_traveled - st.shape_dist_traveled) / 1000) * 0.3 as price,
      'EUR' as currency_type,
      1 as payment_method,
      0 as transfers,
      r.agency as agency_id
      from stop_times st
      inner join stop_times st2 on st.trip = st2.trip and st.stop_sequence < st2.stop_sequence
      inner join trips t on st.trip = t.id
      inner join routes r on t.route = r.id
      inner join stops s on st.stop = s.id
      inner join stops s2 on st2.stop = s2.id
      where ((st2.shape_dist_traveled - st.shape_dist_traveled) / 1000) * 0.3 > 0`,
      ),

      // fares.txt
      tx.result(`
      select
      distinct encode(digest(concat(r.id, s.id, s2.id), 'sha1'), 'hex') as fare_id,
      r.id as route_id,
      s.id as origin_id,
      s2.id as destination_id
      from stop_times st
      inner join stop_times st2 on st.trip = st2.trip and st.stop_sequence < st2.stop_sequence
      inner join trips t on st.trip = t.id
      inner join routes r on t.route = r.id
      inner join stops s on st.stop = s.id
      inner join stops s2 on st2.stop = s2.id
      where ((st2.shape_dist_traveled - st.shape_dist_traveled) / 1000) * 0.3 > 0`),
    ]);
  });

  const feed = queries.map((query) => ({
    header: query.fields.map((f) => f.name),
    values: query.rows.map((row) => Object.values(row)),
  }));

  const feedData = {
    feed_id: 'MetroCar',
    feed_publisher_name: 'MetroCar',
    feed_publisher_url: 'https://metrocar.org',
    feed_lang: 'de',
    feed_start_date: '20220101',
    feed_end_date: '20231231',
    feed_version: 1,
    feed_contact_email: 'contact@metrocar.org',
  };

  const feed_info = {
    header: Object.keys(feedData),
    values: [Object.values(feedData)],
  };

  const [
    stops,
    agency,
    routes,
    stop_times,
    trips,
    calendar_dates,
    calendar,
    shapes,
    fare_attributes,
    fare_rules,
  ] = feed;

  // map data to something else if needed.

  return {
    stops,
    agency,
    routes,
    stop_times,
    trips,
    calendar_dates,
    calendar,
    feed_info,
    shapes,
    fare_attributes,
    fare_rules,
  };
};

export const getGTFSCSV = async () => {
  const gtfsData = await getGTFSData();
  return Object.keys(gtfsData).map((name) => ({
    name,
    content: makeCSV(gtfsData[name]),
  }));
};

export const gtfsZipHandler: RequestHandler = async (_, res) => {
  res.setHeader('Content-Type', 'application/x-zip');

  const gtfs = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  gtfs.pipe(res);

  const gtfsData = await getGTFSCSV();
  gtfsData.forEach(({ name, content }) => {
    gtfs.append(content, { name: `${name}.txt` });
  });

  await gtfs.finalize();
};

export const gtfsTarGzHandler: RequestHandler = async (_, res) => {
  res.setHeader('Content-Type', 'application/gzip');

  const gtfs = archiver('tar', {
    gzip: true,
  });

  gtfs.pipe(res);

  const date = new Date('20-11-2022 00:00:00'); // for gzip we hardcode the date. this gives us a deterministic file hash

  const gtfsData = await getGTFSCSV();
  gtfsData.forEach(({ name, content }) => {
    gtfs.append(content, {
      name: `${name}.txt`,
      date,
    });
  });

  const geojsons = await db.manyOrNone(`
  with sp AS (
    select
      s.id,
      st_buffer((s.shape), .02) as buffer
    from shapes as s
    inner join trips as t on t.shape = s.id
    left join calendar as c on t.calendar = c.id
    where t.start_date > now() - INTERVAL '2 days' or c.end_date > now() - INTERVAL '2 days')
    select st_asgeojson((ST_Dump(un.shape)).geom) as geojson from (select st_union(sp.buffer) as shape from sp) as un;
`);

  if (geojsons.length === 0) {
    await gtfs.finalize();
    return;
  }

  geojsons
    .map((row, id) => ({
      type: 'Feature',
      id,
      geometry: JSON.parse(row.geojson),
    }))
    .forEach((geojson, idx) => {
      gtfs.append(JSON.stringify(geojson), {
        name: `${idx}.geojson`,
        date,
      });
    });

  const extracts = geojsons
    .map((_, idx) => idx)
    .map((num) => ({
      output: `${num}.osm.pbf`,
      polygon: {
        file_name: `${num}.geojson`,
        file_type: 'geojson',
      },
    }));

  const osmosisInstructions = JSON.stringify({
    directory: '.',
    extracts,
  });

  gtfs.append(osmosisInstructions, {
    name: `area.json`,
    date,
  });

  await gtfs.finalize();
};

export const makeCSV = ({ header, values }) =>
  stringify([header, ...values], {
    quoted: true,
  });
