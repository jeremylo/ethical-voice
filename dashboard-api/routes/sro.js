import Router from 'express';
import requireAuth from '../requireAuth.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        trusted: req.user.trusted,
    });
});

// router.use('/activate', activateRoutes);
// router.use('/register', registerRoutes);
// router.use('/email', emailRoutes);
// router.use('/password', passwordRoutes);

export default router;
