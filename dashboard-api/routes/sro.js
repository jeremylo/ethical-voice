import Router from 'express';
import requireAuth from '../requireAuth.js';
import activateRoutes from './sro/activate.js';
import emailRoutes from './sro/email.js';
import inviteRoutes from './sro/invite.js';
import nameRoutes from './sro/name.js';
import passwordRoutes from './sro/password.js';
import transferRoutes from './sro/transfer.js';


const router = Router();

/**
 * Responds with data on the current logged-in SRO.
 */
router.get('/', requireAuth, async (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        trusted: req.user.trusted,
    });
});

router.use('/name', nameRoutes);
router.use('/email', emailRoutes);
router.use('/password', passwordRoutes);
router.use('/invite', inviteRoutes);
router.use('/activate', activateRoutes);
router.use('/transfer', transferRoutes);

export default router;
