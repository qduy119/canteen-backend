import { Application } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import { User } from '@/databases/models';
import { logger } from '@/utils/logger';
import envConfig from '@/config';

export const configure = (app: Application) => {
  app.use(passport.initialize());

  passport.use(
    new GoogleStrategy(
      {
        clientID: envConfig.GOOGLE_CLIENT_ID,
        clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        callbackURL: envConfig.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { provider } = profile;
          const profileJson = profile['_json'];
          const {
            sub: id,
            name: fullName,
            picture: avatar,
            email
          } = profileJson;
          const user = await User.findOne({ where: { email } });
          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              id,
              fullName,
              avatar,
              email,
              provider
            });
            done(null, newUser);
          }
        } catch (error) {
          logger.error(error);
          done(error);
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: envConfig.GITHUB_CLIENT_ID,
        clientSecret: envConfig.GITHUB_CLIENT_SECRET,
        callbackURL: envConfig.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { provider } = profile;
          const profileJson = profile['_json'];
          const {
            avatar_url: avatar,
            node_id: id,
            login: fullName,
            email
          } = profileJson;
          const user = await User.findOne({ where: { email } });
          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              id,
              fullName,
              avatar,
              email,
              provider
            });
            done(null, newUser);
          }
        } catch (error) {
          logger.error(error);
          done(error);
        }
      }
    )
  );
};
