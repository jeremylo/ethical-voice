import Router from 'express';
import requireAuth from '../requireAuth.js';
import nameRoutes from './sro/name.js';
import passwordRoutes from './sro/password.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        trusted: req.user.trusted,
    });
});

router.use('/name', nameRoutes);
router.use('/password', passwordRoutes);

export default router;
