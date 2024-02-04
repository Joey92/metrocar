import express from 'express';
import passport from 'passport';

import {
  gtfsAlertsHandler,
  gtfsRTHandler,
  gtfsTripUpdatesHandler,
  gtfsVehicleUpdatesHandler,
  gtfsRTAlertsHandler,
  gtfsRTTripUpdatesHandler,
} from './gtfs/rt';

import './auth';
import { gtfsTarGzHandler, gtfsZipHandler } from './gtfs/gtfs';
import {
  getStopsOnRouteHandler,
  createTripHandler,
  cancelTripHandler,
} from './trips';
import { autocompleteQuery, searchHandler } from './search';
import { getStopDeparturesHandler, getStopRoutesHandler } from './stops';

import i18middleware from 'i18next-http-middleware';
import i18next from 'i18next';
import './common/translation';

import { osmosisInstructionsHandler } from './map';
import { vehicleUpdateHandler } from './gtfs/rt/vehicleUpdate';

const app = express();

app.use(express.json()); // for parsing application/json

app.use(i18middleware.handle(i18next));

app.use(passport.initialize());

app.get('/autocomplete', autocompleteQuery);

app.get('/stops/:id/routes', getStopRoutesHandler);
app.get('/stops/:id/departures/:date', getStopDeparturesHandler);

app.get('/gtfs/rt/feed', gtfsRTHandler);

app.get('/gtfs/rt/feed/all', gtfsRTHandler);
app.get('/gtfs/rt/feed/alerts', gtfsRTAlertsHandler);
app.get('/gtfs/rt/feed/tripUpdates', gtfsRTTripUpdatesHandler);

app.post('/gtfs/rt/gps', vehicleUpdateHandler);

app.get('/gtfs/rt/alerts', gtfsAlertsHandler); // alerts in json
app.get('/gtfs/rt/trips', gtfsTripUpdatesHandler); // trip updates in json
app.get('/gtfs/rt/vehicles', gtfsVehicleUpdatesHandler); // vehicle updates in json

app.get('/gtfs.zip', gtfsZipHandler); // Respons with official gtfs specification
app.get('/gtfs.tar.gz', gtfsTarGzHandler); // more for internal use

app.get('/health', (_, res) => res.json({ healthy: true }));

app.get('/trips/area', osmosisInstructionsHandler);

app.get('/search', passport.authenticate(['jwt', 'anonymous']), searchHandler);

app.post(
  '/trips',
  passport.authenticate('jwt', { session: false }),
  createTripHandler,
);
app.delete(
  '/trips/:id',
  passport.authenticate('jwt', { session: false }),
  cancelTripHandler,
);

app.post(
  '/fetchStops',
  passport.authenticate('jwt', { session: false }),
  getStopsOnRouteHandler,
);

app.options('*', (_, res) => res.sendStatus(200));

const server = app.listen(8080, () => {
  console.log('Server ready');
});

process.stdin.resume(); //so the program will not close instantly

const exitHandler = () => {
  server.close(() => {
    console.log('server closed');
    process.exit(0);
  });
};

//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
