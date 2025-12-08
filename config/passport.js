import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

passport.use(new LocalStrategy({ 
    usernameField: 'email' 
}, 
async (email, password, done) => {
    try {
        const formattedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: formattedEmail });

        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user); 
    } catch (err) {
        return done(err); 
    }
}));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, 
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id).select('-password'); 

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});