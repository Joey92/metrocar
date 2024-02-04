import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

export default i18next.use(Backend).init({
  initImmediate: false,
  fallbackLng: 'en',
  lng: 'en',
  ns: ['email', 'notifications'],
  defaultNS: 'email',
  backend: {
    // path where resources get loaded from, or a function
    // returning a path:
    // function(lngs, namespaces) { return customPath; }
    // the returned path will interpolate lng, ns if provided like giving a static path
    loadPath: '/app/locales/{{lng}}/{{ns}}.yaml',

    // path to post missing resources
    addPath: '/app/locales/{{lng}}/{{ns}}.missing.yaml',

    // if you use i18next-fs-backend as caching layer in combination with i18next-chained-backend, you can optionally set an expiration time
    // an example on how to use it as cache layer can be found here: https://github.com/i18next/i18next-fs-backend/blob/master/example/caching/app.js
    // expirationTime: 60 * 60 * 1000
  },
});
