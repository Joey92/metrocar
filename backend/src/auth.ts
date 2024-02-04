import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import _ from 'lodash';

import { jwtVerifyKey } from './common/config';
import { db } from './common/db';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtVerifyKey,
  algorithms: ['HS256'],
  issuer: 'directus',
};

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
}

passport.use(new AnonymousStrategy());

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwtPayload, done) => {
    db.oneOrNone<User>('SELECT * FROM directus_users WHERE id = $1::uuid', [
      jwtPayload.id,
    ])
      .then((user) => {
        if (!user) {
          done(null, false);
          return;
        }

        const { id, display_name, email, role } = user;

        done(null, {
          id,
          display_name,
          email,
          role,
        });
      })
      .catch((err) => {
        console.error(err);
        return done(err, false);
      });
  }),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser<Express.User>(function (user, done) {
  done(null, user);
});
