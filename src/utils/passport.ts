import passport from "passport";
import PassportSteam from "passport-steam";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(
  new PassportSteam.Strategy(
    {
      returnURL: process.env.PASSPORT_CALLBACK_URL,
      realm: process.env.PASSPORT_REALM_URL,
      apiKey: process.env.STEAM_API_KEY
    },
    (identifier: any, profile: any, done: (arg0: null, arg1: any) => any) => {
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

export default passport;
