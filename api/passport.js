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
        .catch(() => done("This user could not be retrieved.", false));
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await findUserByEmail(email);
            if (!(await isValidPasswordHash(password, user.password))) {
                done(null, false);
            }
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    }
));

passport.use(new RememberMeStrategy(consumeRememberMeToken, issueRememberMeToken));

export default passport;
