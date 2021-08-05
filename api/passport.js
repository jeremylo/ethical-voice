import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as RememberMeStrategy } from 'passport-remember-me';
import { consumeRememberMeToken, issueRememberMeToken } from './remember-me.js';
import { findUserByEmail, findUserById } from './users.js';


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findUserById(id)
        .then((user) => done(null, user))
        .catch(() => done("This user could not be retrieved.", null));
});

passport.use(new LocalStrategy(
    async (email, password, done) => {
        try {
            const user = await findUserByEmail(email);
            if (!(await bcrypt.compare(password, user.password))) {
                throw new Error("Incorrect password.")
            }
            return done(null, user);
        } catch (e) {
            return done(e, false, { message: 'Incorrect email or password.' });
        }
    }
));

passport.use(new RememberMeStrategy(consumeRememberMeToken, issueRememberMeToken));

export default passport;
