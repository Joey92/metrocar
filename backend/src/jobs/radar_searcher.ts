import { db } from '../common/db';
import directus from '../common/directus';
import { searchRequest } from '../search';
import { Radar } from '../types';
import translations from '../common/translation';
import { frontendUrl } from '../common/config';

async function* fetchRadars() {
  while (true) {
    const rawRadar = await db.manyOrNone(
      `SELECT
        *,
        ST_AsGeoJSON("from") as "from",
        ST_AsGeoJSON("to") as "to"

      FROM
        trip_radar
      WHERE (has_search_results is null or has_search_results = false) AND date > CURRENT_TIMESTAMP`,
    );

    if (rawRadar.length === 0) {
      return;
    }

    const radars = rawRadar.map(
      (radar) =>
        ({
          ...radar,
          from: JSON.parse(radar.from),
          to: JSON.parse(radar.to),
        } as Radar),
    );

    while (radars.length > 0) {
      yield radars.pop();
    }
  }
}

const processRadar = async (radar: Radar) => {
  const search = await searchRequest(
    radar.from.coordinates,
    radar.to.coordinates,
    radar.from_name,
    radar.to_name,
  );

  const t = await translations;

  if (search.itineraries.length > 0) {
    if (radar.user_created) {
      try {
        await directus.post('/notifications', {
          recipient: radar.user_created,
          subject: t('trip_radar.subject', { ns: 'notifications', lng: 'en' }),
          message: t('trip_radar.message', {
            ns: 'notifications',
            lng: 'en',
            origin: radar.from_name,
            destination: radar.to_name,
            amount: search.itineraries.length,
            url: `${frontendUrl}/my/radars`,
          }),
          collection: 'trip_radar',
          item: radar.id,
        });
      } catch (e) {
        console.error(e.response.data.errors);
      }
    }

    await db.none(
      'UPDATE trip_radar SET has_search_results = true WHERE id = $1',
      [radar.id],
    );
    return;
  }

  await db.none(
    'UPDATE trip_radar SET has_search_results = false WHERE id = $1',
    [radar.id],
  );
};

let _processedRadars = 0;
const main = async () => {
  const radars = fetchRadars();

  while (true) {
    const radar = await radars.next();

    if (!radar.value) {
      console.log('All radars processed');

      return;
    }

    await processRadar(radar.value);
    _processedRadars++;
  }
};

main()
  .then(() => console.log('processed', _processedRadars, 'radars'))
  .catch()
  .finally(() => {
    db.$pool.end();
  });
