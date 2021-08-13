import Router from 'express';
import { updateSroPassword } from '../../persistence/sros.js';
import requireAuth from '../../requireAuth.js';
import { hashPassword, isValidPasswordHash } from '../../utils.js';


const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).json({ "error": "Not enough information was provided to effectuate the password change." });
    }

    if (!(await isValidPasswordHash(req.body.oldPassword, req.user.password))) {
        return res.status(401).json({ "error": "The password was incorrect." });
    }

    try {
        await updateSroPassword(req.user, await hashPassword(req.body.newPassword));
        return res.status(200).json({ message: "The password was updated successfully." });
    } catch (e) {
        return res.status(500).json({ message: "The password could not be updated successfully." });
    }
});

export default router;
