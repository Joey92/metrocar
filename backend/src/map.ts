import archiver from 'archiver';
import { RequestHandler } from 'express';
import { db } from './common/db';

/**
 * Get the area of trips. This helps to cut out maps for other services
 */
export const osmosisInstructionsHandler: RequestHandler = async (_, res) => {
  res.setHeader('Content-Type', 'application/x-zip');

  const zip = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  zip.pipe(res);

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
    res.sendStatus(204);
    return;
  }

  geojsons
    .map((row, id) => ({
      type: 'Feature',
      id,
      geometry: JSON.parse(row.geojson),
    }))
    .forEach((geojson, idx) => {
      zip.append(JSON.stringify(geojson), { name: `${idx}.geojson` });
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

  zip.append(osmosisInstructions, { name: `area.json` });

  await zip.finalize();
};
