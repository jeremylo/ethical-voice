import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findSroByEmail, findSroById } from './persistence/sros.js';
import { isValidPasswordHash } from './utils.js';


/**
 * 'Serialise' an SRO object by just keeping their ID.
 */
passport.serializeUser(function (sro, done) {
    done(null, sro.id);
});

/**
 * Deserialise an SRO by fetching their database record from their ID.
 */
passport.deserializeUser(function (id, done) {
    findSroById(id)
        .then((sro) => done(null, sro))
        .catch(() => done("This SRO could not be retrieved.", false));
});

/**
 *  Sets up the local strategy, which verifies an SRO's credentials as part of the login process.
 */
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const sro = await findSroByEmail(email);
            if (!sro || !(await isValidPasswordHash(password, sro.password))) {
                done(null, false);
            }
            return done(null, sro);
        } catch (e) {
            return done(e);
        }
    }
));

export default passport;
