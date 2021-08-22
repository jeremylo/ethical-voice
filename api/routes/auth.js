import Router from 'express';
import passport from '../passport.js';
import { issueRememberMeToken } from '../remember-me.js';


const router = Router();

/**
 * Logs the user in.
 */
router.post('/login',
    (req, res, next) => {
        if (req.user) {
            return res.redirect('/');
        }

        return next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ error: "Login failure." });
            }

            req.login(user, (err2) => {
                if (err2) {
                    return next(err2);
                }

                try {
                    issueRememberMeToken(user).then(token => {
                        if (res.headersSent) return next();

                        res.cookie(
                            process.env.APP_REMEMBER_ME_COOKIE_NAME,
                            token,
                            {
                                path: '/',
                                httpOnly: true,
                                maxAge: 604800000,
                                secure: true,
                                sameSite: true
                            }
                        );
                        return next();
                    });
                } catch (err3) {
                    return next(err3);
                }
            });
        })(req, res, next);
    },
    (req, res) => {
        return res.status(200).json({
            refId: req.user.reference_id,
            email: req.user.email,
            outwardPostcode: req.user.outward_postcode,
            sharing: req.user.sharing === 1
        });
    }
);

/**
 * Logs the user out.
 */
router.get('/logout', async (req, res) => {
    // clear the remember-me cookie on logout
    res.clearCookie(process.env.APP_REMEMBER_ME_COOKIE_NAME, { path: '/' });
    req.session.destroy();
    req.logout();
    return res.status(200).json({ message: "Logging out successful." });
});


export default router;
