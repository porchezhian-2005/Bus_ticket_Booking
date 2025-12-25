import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Admin from "../models/adminModel.js";

passport.use(
  "admin-local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const admin = await Admin.findOne({ email });
        if (!admin) return done(null, false, { message: "Incorrect email." });
        if (!admin.isAdmin) return done(null, false, { message: "Not an admin." });

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) return done(null, false, { message: "Incorrect password." });

        return done(null, admin);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.serializeUser((admin, done) => done(null, admin.id));
passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (err) {
    done(err);
  }
});

export default passport;
