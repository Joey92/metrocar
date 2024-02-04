import fs from 'fs';
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}

let jwtKey;

if (!process.env.JWT_PRIVATE_KEY?.startsWith('/run/secrets')) {
  // URL directly passed
  console.log('using jwt private key from env');
  jwtKey = process.env.JWT_PRIVATE_KEY;
} else {
  // path to file/secret
  console.log('using jwt private key from file');
  jwtKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY, { encoding: 'utf8' });
}

export const jwtVerifyKey = jwtKey;

export const POSTGRES_URL =
  process.env.POSTGRES_URL || 'postgres://root:root@127.0.0.1/metrocar';

if (POSTGRES_URL === '') {
  throw new Error('POSTGRES_URL needs to be set in the environment!');
}

let postgres = '';

if (POSTGRES_URL.startsWith('postgres://')) {
  // URL directly passed
  postgres = POSTGRES_URL;
} else {
  // path to file/secret
  postgres = fs.readFileSync(POSTGRES_URL, 'utf8');
}

export const frontendUrl = process.env.FRONTEND_URL || 'https://metrocar.org';
export const postgresUrl = postgres;

export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6380/1';

export const GRAPHHOPPER_URL =
  process.env.GRAPHHOPPER_URL || 'http://127.0.0.1:8989';

export const OTP_URL = process.env.OTP_URL || 'http://127.0.0.1:8082';

export const NOMINATIM_URL =
  process.env.NOMINATIM_URL || 'http://127.0.0.1:8083';

export const PHOTON_URL = process.env.PHOTON_URL || 'photon';

export const DIRECTUS_URL = process.env.DIRECTUS_URL;
export const DIRECTUS_USER_TOKEN = process.env.DIRECTUS_USER_TOKEN;

export const INTERNAL_DEFAULT_AGENCY_ID =
  process.env.INTERNAL_DEFAULT_AGENCY_ID;
