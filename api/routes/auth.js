import Router from 'express';
import passport from '../passport.js';
import { issueRememberMeToken } from '../remember-me.js';
import requireAuth from '../requireAuth.js';
import { updateUserOutwardPostcode, updateUserPassword, updateUserSharing } from '../users.js';
import { hashPassword, isValidOutwardPostcode, isValidPasswordHash } from './utils.js';

const router = Router();

router.post('/login',
    (req, res, next) => {
        if (req.user) {
            return res.redirect('/');
        }

        next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(401);
                res.json({
                    error: "Login failure."
                });
                return;
            }

            req.login(user, (err2) => {
                if (err2) {
                    return next(err2);
                }

                try {
                    issueRememberMeToken(user).then(token => {
                        res.cookie(
                            process.env.REMEMBER_ME_COOKIE_NAME,
                            token,
                            {
                                path: '/',
                                httpOnly: true,
                                maxAge: 604800000,
                                secure: true,
                                sameSite: true
                            });
                        return next();
                    });
                } catch (err3) {
                    next(err3);
                }
            });
        })(req, res, next);
    },
    (req, res) => {
        res.status(200);
        res.json({
            refId: req.user.reference_id,
            email: req.user.email,
            outwardPostcode: req.user.outward_postcode,
            sharing: req.user.sharing === 1
        });
    });

router.get('/logout', async (req, res) => {
    // clear the remember-me cookie on logout
    res.clearCookie(process.env.REMEMBER_ME_COOKIE_NAME, { path: '/' });
    req.session.destroy();
    req.logout();
    res.status(200);
    res.json({
        message: "Logging out successful."
    })
});

router.get('/user', requireAuth, async (req, res) => {
    try {
        res.status(200);
        res.json({
            refId: req.user.reference_id,
            email: req.user.email,
            outwardPostcode: req.user.outward_postcode,
            sharing: req.user.sharing === 1
        });
    } catch (e) {
        res.status(500);
        res.json({
            error: "User information could not be retrieved."
        });
    }

});

router.post('/user/password', requireAuth, async (req, res) => {
    if (req.body.oldPassword && req.body.newPassword) {
        if (!(await isValidPasswordHash(req.body.oldPassword, req.user.password))) {
            res.status(401);
            res.json({
                "error": "The password was incorrect."
            });
        }

        try {
            updateUserPassword(req.user, await hashPassword(req.body.newPassword));
            res.status(200);
            res.json({
                message: "The password was updated successfully."
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "The password could not be updated successfully."
            });
        }

    }
});

router.post('/user/outwardpostcode', requireAuth, async (req, res) => {
    if (req.body.outwardPostcode && isValidOutwardPostcode(req.body.outwardPostcode)) {
        try {
            updateUserOutwardPostcode(req.user, req.body.outwardPostcode);
            res.status(200);
            res.json({
                message: "The outward postcode was updated successfully."
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "The outward postcode could not be updated successfully."
            });
        }

    }
});

router.post('/user/sharing', requireAuth, async (req, res) => {
    if (req.body.sharing !== undefined && typeof req.body.sharing === "boolean") {
        try {
            updateUserSharing(req.user, req.body.sharing);
            res.status(200);
            res.json({
                message: "The sharing agreement status was updated successfully."
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "The sharing agreement status could not be updated successfully."
            });
        }

    }
});

export default router;
