import pgp from 'pg-promise';
import * as config from './config';

export const pg = pgp();
export const db = pg({
  max: 200,
  connectionString: config.postgresUrl,
});
