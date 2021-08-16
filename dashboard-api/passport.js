import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findSroByEmail, findSroById } from './persistence/sros.js';
import { isValidPasswordHash } from './utils.js';


passport.serializeUser(function (sro, done) {
    done(null, sro.id);
});

passport.deserializeUser(function (id, done) {
    findSroById(id)
        .then((sro) => done(null, sro))
        .catch(() => done("This SRO could not be retrieved.", false));
});

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
