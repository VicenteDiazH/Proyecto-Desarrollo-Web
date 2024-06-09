import passport from "passport";
import passportLocal from "passport-local";
import User from "../models/user.model.js";
const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Not user Found" });
      } else {
        const match = await user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
 try {
   const user = await User.findById(id);
     done(null, user);
 } catch (error) {
   done(error);
 }
});
