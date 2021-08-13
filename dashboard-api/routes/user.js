import Router from 'express';
import requireAuth from '../requireAuth.js';
import activateRoutes from './user/activate.js';
import emailRoutes from './user/email.js';
import passwordRoutes from './user/password.js';
import registerRoutes from './user/register.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    return res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        trusted: req.user.trusted,
    });
});

export default router;
