import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as RememberMeStrategy } from 'passport-remember-me';
import { findUserByEmail, findUserById } from './persistence/users.js';
import { consumeRememberMeToken, issueRememberMeToken } from './remember-me.js';
import { isValidPasswordHash } from './utils.js';


/**
 * 'Serialise' a user by just keeping their ID.
 */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

/**
 * Deserialise a user by fetching their database record from their ID.
 */
passport.deserializeUser(function (id, done) {
    findUserById(id)
        .then((user) => done(null, user))
        .catch(() => done("This user could not be retrieved.", false));
});

/**
 *  Sets up the local strategy, which verifies a user's credentials as part of the login process.
 */
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
            return done(e);
        }
    }
));

/**
 * Sets up the remember me strategy to prevent app users being forcefully logged out frequently.
 */
passport.use(new RememberMeStrategy(consumeRememberMeToken, (user, done) => {
    issueRememberMeToken(user)
        .then(_ => done(null, token))
        .catch(e => done(e));
}));

export default passport;
