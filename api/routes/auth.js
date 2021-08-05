import Router from 'express';
import { findUserById } from '../users.js';

const loggedInUser = 1;

const router = Router();

router.get('/user', async (req, res) => {
    try {
        const user = findUserById(loggedInUser);

        res.status(200);
        res.json({
            refId: user.reference_id,
            email: user.email,
            outwardPostcode: user.outward_postcode,
            sharing: user.sharing === 1
        });
    } catch (e) {
        res.status(500);
        res.json({
            error: "User information could not be retrieved."
        });
    }

});

export default router;
