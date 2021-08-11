import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as RememberMeStrategy } from 'passport-remember-me';
import { findUserByEmail, findUserById } from './persistence/users.js';
import { consumeRememberMeToken, issueRememberMeToken } from './remember-me.js';
import { isValidPasswordHash } from './utils.js';


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
            if (!user || !(await isValidPasswordHash(password, user.password))) {
                done(null, false);
            }
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    }
));

passport.use(new RememberMeStrategy(consumeRememberMeToken, (user, done) => {
    issueRememberMeToken(user)
        .then(_ => done(null, token))
        .catch(e => done(e));
}));

export default passport;
