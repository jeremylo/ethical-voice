import Router from 'express';
import { updateUserOutwardPostcode, updateUserSharing } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { isValidOutwardPostcode } from '../utils.js';
import activateRoutes from './user/activate.js';
import emailRoutes from './user/email.js';
import passwordRoutes from './user/password.js';
import registerRoutes from './user/register.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        return res.status(200).json({
            refId: req.user.reference_id,
            email: req.user.email,
            outwardPostcode: req.user.outward_postcode,
            sharing: req.user.sharing === 1
        });
    } catch (e) {
        return res.status(500).json({ error: "User information could not be retrieved." });
    }
});

router.use('/activate', activateRoutes);
router.use('/register', registerRoutes);
router.use('/email', emailRoutes);
router.use('/password', passwordRoutes);

router.post('/outwardpostcode', requireAuth, async (req, res) => {
    if (!req.body.outwardPostcode || !isValidOutwardPostcode(req.body.outwardPostcode)) {
        return res.status(400).json({ message: "Bad outward postcode input D:" });
    }

    try {
        await updateUserOutwardPostcode(req.user.id, req.body.outwardPostcode);
        return res.status(200).json({ message: "The outward postcode was updated successfully." });
    } catch (e) {
        return res.status(500).json({ message: "The outward postcode could not be updated successfully." });
    }
});

router.post('/sharing', requireAuth, async (req, res) => {
    if (req.body.sharing === undefined || typeof req.body.sharing !== "boolean") {
        return res.status(400).json({ message: "Bad sharing agreement status provided." });
    }

    try {
        await updateUserSharing(req.user.id, req.body.sharing);
        return res.status(200).json({ message: "The sharing agreement status was updated successfully." });
    } catch (e) {
        return res.status(500).json({ message: "The sharing agreement status could not be updated successfully." });
    }
});


export default router;
