import Router from 'express';
import passport from '../passport.js';
import { requireNoAuth } from '../requireAuth.js';


const router = Router();

router.post('/login', requireNoAuth,
    (req, res, next) => {
        passport.authenticate('local', (err, sro, info) => {
            if (err || !sro) { return res.status(401).json({ error: "Login failure." }); }
            req.login(sro, (err2) => {
                if (err2) {
                    return next(err2);
                } else {
                    next();
                }
            });
        })(req, res, next);
    },
    (req, res) => {
        return res.status(200).json({
            name: req.user.name,
            email: req.user.email,
            trusted: req.user.trusted,
        });
    });

router.get('/logout', async (req, res) => {
    req.session.destroy();
    req.logout();
    return res.status(200).json({ message: "Logging out successful." });
});


export default router;
